import type {
  File as ParseFile,
  Object as ParseObject,
} from "parse";

import type { Produto } from "../../types/domain";
import Parse from "./client";
import { uploadFile } from "./file.service";

const LIST_LIMIT = 200;

interface CategoriaAttributes {
  nome?: string;
}

interface ProdutoAttributes {
  id_categoria?: ParseObject<CategoriaAttributes>;
  imagem?: ParseFile;
  nome?: string;
  descricao?: string;
  preco?: number;
}

type CategoriaObject = ParseObject<CategoriaAttributes>;
type ProdutoObject = ParseObject<ProdutoAttributes>;
type ParseObjectClass<T extends ParseObject> = {
  new (): T;
  createWithoutData(id: string): T;
};

const CategoriaModel = Parse.Object.extend("Categoria") as ParseObjectClass<CategoriaObject>;
const ProdutoModel = Parse.Object.extend("Produto") as ParseObjectClass<ProdutoObject>;

export interface CreateProdutoInput {
  categoriaId: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: File | null;
}

export interface UpdateProdutoInput extends Omit<CreateProdutoInput, "categoriaId"> {}

function requireObjectId(object: ParseObject, className: string): string {
  if (!object.id) {
    throw new Error(`${className} sem identificador.`);
  }

  return object.id;
}

function normalizePrice(value: unknown): number {
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) ? price : 0;
}

function mapProduto(produto: ProdutoObject): Produto {
  return {
    id: requireObjectId(produto, "Produto"),
    nome: produto.get("nome") ?? "",
    descricao: produto.get("descricao") ?? "",
    preco: normalizePrice(produto.get("preco")),
    imagem: produto.get("imagem")?.url() ?? "",
  };
}

function requireInputId(id: string, label: string): string {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error(`${label} inválido.`);
  }

  return id;
}

function validateProdutoInput(input: Pick<CreateProdutoInput, "nome" | "preco">): void {
  if (!input.nome.trim()) throw new Error("Informe o nome do produto.");
  if (!Number.isFinite(input.preco) || input.preco < 0) {
    throw new Error("Informe um preço válido para o produto.");
  }
}

export async function fetchProdutosByCategoriaId(categoriaId: string): Promise<Produto[]> {
  const categoria = CategoriaModel.createWithoutData(
    requireInputId(categoriaId, "Categoria"),
  );
  const query = new Parse.Query<ProdutoObject>(ProdutoModel);
  query.equalTo("id_categoria", categoria);
  query.ascending("nome");
  query.limit(LIST_LIMIT);
  query.select("nome", "descricao", "preco", "imagem");

  const produtos = await query.find();
  return produtos.map(mapProduto);
}

export async function getProdutoById(id: string): Promise<Produto> {
  const produto = await new Parse.Query<ProdutoObject>(ProdutoModel).get(
    requireInputId(id, "Produto"),
  );
  return mapProduto(produto);
}

export async function createProduto(input: CreateProdutoInput): Promise<Produto> {
  validateProdutoInput(input);
  const produto = new ProdutoModel();
  produto.set(
    "id_categoria",
    CategoriaModel.createWithoutData(requireInputId(input.categoriaId, "Categoria")),
  );
  produto.set("nome", input.nome.trim());
  produto.set("descricao", input.descricao);
  produto.set("preco", input.preco);

  if (input.imagem) {
    produto.set("imagem", await uploadFile(input.imagem, "produto.png"));
  }

  await produto.save();
  return mapProduto(produto);
}

export async function updateProduto(id: string, input: UpdateProdutoInput): Promise<void> {
  validateProdutoInput(input);
  const produto = ProdutoModel.createWithoutData(requireInputId(id, "Produto"));
  produto.set("nome", input.nome.trim());
  produto.set("descricao", input.descricao);
  produto.set("preco", input.preco);

  if (input.imagem) {
    produto.set("imagem", await uploadFile(input.imagem, "produto.png"));
  }

  await produto.save();
}

export async function deleteProduto(id: string): Promise<void> {
  await ProdutoModel.createWithoutData(requireInputId(id, "Produto")).destroy();
}
