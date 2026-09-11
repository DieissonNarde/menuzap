export interface Usuario {
  id: string;
  nome: string;
  username: string;
  email: string;
}

export interface CadastroUsuarioInput {
  nome: string;
  username: string;
  email: string;
  password: string;
}

export interface Empresa {
  id: string;
  nome: string;
  subdominio: string;
  logo: string;
  cnpj: string;
  email: string;
  celular: string;
  telefone: string;
  inicioSemanaAberto: string;
  fimSemanaAberto: string;
  inicioHorarioNormal: string;
  fimHorarioNormal: string;
  inicioHorarioFeriado: string;
  fimHorarioFeriado: string;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  numero: string;
}

export interface Categoria {
  id: string;
  nome: string;
  imagem?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
}

export interface ItemCarrinho extends Produto {
  amount: number;
}

export interface ItemCarrinhoViewModel extends ItemCarrinho {
  priceFormatted: string;
  subTotal: string;
}

export type StatusPedido =
  | "novo"
  | "em andamento"
  | "pronto"
  | "em transporte"
  | "finalizado"
  | "cancelado";

export const STATUS_PEDIDO: readonly StatusPedido[] = [
  "novo",
  "em andamento",
  "pronto",
  "em transporte",
  "finalizado",
  "cancelado",
];

export type TipoPagamento = "dinheiro" | "debito" | "credito" | "pix";
export type TipoEntrega = "mesa" | "buscar" | "delivery";

export const TIPOS_PAGAMENTO: readonly TipoPagamento[] = [
  "dinheiro",
  "debito",
  "credito",
  "pix",
];

export const TIPOS_ENTREGA: readonly TipoEntrega[] = [
  "mesa",
  "buscar",
  "delivery",
];

export interface ClientePedido {
  nome: string;
  cpf: string;
  celular: string;
}

export interface EnderecoEntrega {
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  numero: string;
}

export interface Pedido {
  id: string;
  nome: string;
  cpf: string;
  celular: string;
  tipoPagamento: TipoPagamento;
  trocoPagamento: string;
  tipoEntrega: TipoEntrega;
  mesa: string;
  horas: string;
  endereco: EnderecoEntrega;
  produtos: ItemCarrinho[];
  valorTotal: number;
  status: StatusPedido;
  createdAt: Date;
}

export interface PedidoResumo {
  id: string;
  nome: string;
  cpf: string;
  tipoPagamento: TipoPagamento | "";
  tipoEntrega: TipoEntrega | "";
  valorTotal: number;
  status: StatusPedido;
  createdAt: Date;
}

export interface CriarPedidoInput {
  subdominio: string;
  cliente: ClientePedido;
  tipoPagamento: TipoPagamento;
  trocoPagamento: string;
  tipoEntrega: TipoEntrega;
  mesa: string;
  horas: string;
  endereco: EnderecoEntrega;
  produtos: ItemCarrinho[];
}
