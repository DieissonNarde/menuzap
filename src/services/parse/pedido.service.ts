import {
  STATUS_PEDIDO,
  TIPOS_ENTREGA,
  TIPOS_PAGAMENTO,
} from "../../types/domain";
import type { ItemCarrinho, PedidoResumo, StatusPedido, TipoEntrega, TipoPagamento } from "../../types/domain";
import type { CriarPedidoInput } from "../../types/domain";
import Parse from "./client";

interface EmpresaAttributes {
  id_user?: Parse.User;
  subdominio?: string;
}

interface PedidoAttributes {
  id_empresa?: Parse.Object<EmpresaAttributes>;
  nome?: string;
  cpf?: string;
  celular?: string;
  tipoPagamento?: string;
  trocoPagamento?: string;
  tipoEntrega?: string;
  mesa?: string;
  horas?: string;
  cep?: string;
  uf?: string;
  cidade?: string;
  logradouro?: string;
  bairro?: string;
  numero?: string;
  produtos?: ItemCarrinho[];
  valorTotal?: number;
  status?: string;
}

function isTipoPagamento(value: unknown): value is TipoPagamento {
  return TIPOS_PAGAMENTO.includes(value as TipoPagamento);
}

function isTipoEntrega(value: unknown): value is TipoEntrega {
  return TIPOS_ENTREGA.includes(value as TipoEntrega);
}

export function isStatusPedido(value: unknown): value is StatusPedido {
  return STATUS_PEDIDO.includes(value as StatusPedido);
}

function mapPedido(pedido: Parse.Object<PedidoAttributes>): PedidoResumo {
  if (!pedido.id) {
    throw new Error("O Parse retornou um pedido sem identificador.");
  }

  const tipoPagamento = pedido.get("tipoPagamento");
  const tipoEntrega = pedido.get("tipoEntrega");
  const status = pedido.get("status");

  return {
    id: pedido.id,
    nome: pedido.get("nome") ?? "",
    cpf: pedido.get("cpf") ?? "",
    tipoPagamento: isTipoPagamento(tipoPagamento) ? tipoPagamento : "",
    tipoEntrega: isTipoEntrega(tipoEntrega) ? tipoEntrega : "",
    valorTotal: pedido.get("valorTotal") ?? 0,
    status: isStatusPedido(status) ? status : "novo",
    createdAt: pedido.createdAt ?? new Date(0),
  };
}

function normalizeProdutos(produtos: ItemCarrinho[]): ItemCarrinho[] {
  return produtos.map((produto) => {
    const preco = Number(produto.preco);
    const amount = Number(produto.amount);

    if (!Number.isFinite(preco) || preco < 0 || !Number.isInteger(amount) || amount < 1) {
      throw new Error(`O produto ${produto.nome || produto.id} possui preço ou quantidade inválida.`);
    }

    return {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      preco,
      imagem: produto.imagem ?? "",
      amount,
    };
  });
}

export async function fetchPedidosForCurrentUser(): Promise<PedidoResumo[]> {
  const currentUser = Parse.User.current();
  if (!currentUser) return [];

  const empresaQuery = new Parse.Query<Parse.Object<EmpresaAttributes>>("Empresa");
  empresaQuery.equalTo("id_user", currentUser);
  const empresa = await empresaQuery.first();

  if (!empresa) return [];

  const pedidoQuery = new Parse.Query<Parse.Object<PedidoAttributes>>("Pedido");
  pedidoQuery.equalTo("id_empresa", empresa);
  pedidoQuery.descending("createdAt");
  pedidoQuery.limit(1000);
  const pedidos = await pedidoQuery.find();

  return pedidos.map(mapPedido);
}

export async function createPedido(input: CriarPedidoInput): Promise<string> {
  const subdominio = input.subdominio?.trim();
  if (!subdominio) throw new Error("Estabelecimento inválido.");
  if (!isTipoPagamento(input.tipoPagamento)) throw new Error("Selecione uma forma de pagamento.");
  if (!isTipoEntrega(input.tipoEntrega)) throw new Error("Selecione uma forma de entrega.");

  const produtos = normalizeProdutos(input.produtos);
  if (produtos.length === 0) throw new Error("O carrinho está vazio.");

  const empresaQuery = new Parse.Query<Parse.Object<EmpresaAttributes>>("Empresa");
  empresaQuery.equalTo("subdominio", subdominio);
  const empresa = await empresaQuery.first();
  if (!empresa) throw new Error("Estabelecimento não encontrado.");

  const pedido = new Parse.Object<PedidoAttributes>("Pedido");
  pedido.set("id_empresa", empresa);
  pedido.set("nome", input.cliente.nome.trim());
  pedido.set("cpf", input.cliente.cpf);
  pedido.set("celular", input.cliente.celular);
  pedido.set("tipoPagamento", input.tipoPagamento);
  pedido.set("trocoPagamento", input.trocoPagamento);
  pedido.set("tipoEntrega", input.tipoEntrega);
  pedido.set("mesa", input.mesa);
  pedido.set("horas", input.horas);
  pedido.set("cep", input.endereco.cep);
  pedido.set("uf", input.endereco.uf);
  pedido.set("cidade", input.endereco.cidade);
  pedido.set("logradouro", input.endereco.logradouro);
  pedido.set("bairro", input.endereco.bairro);
  pedido.set("numero", input.endereco.numero);
  pedido.set("produtos", produtos);
  pedido.set(
    "valorTotal",
    produtos.reduce((total, produto) => total + produto.preco * produto.amount, 0),
  );
  pedido.set("status", "novo");

  const savedPedido = await pedido.save();
  if (!savedPedido.id) throw new Error("O pedido foi salvo sem identificador.");

  return savedPedido.id;
}

export async function updatePedidoStatus(id: string, status: StatusPedido): Promise<void> {
  if (!id) throw new Error("Pedido inválido.");
  if (!isStatusPedido(status)) throw new Error("Status de pedido inválido.");

  const pedido = await new Parse.Query<Parse.Object<PedidoAttributes>>("Pedido").get(id);
  pedido.set("status", status);
  await pedido.save();
}
