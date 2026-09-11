import type {
  File as ParseFile,
  Object as ParseObject,
  User as ParseUser,
} from "parse";

import type { Categoria } from "../../types/domain";
import Parse from "./client";
import { uploadFile } from "./file.service";

const LIST_LIMIT = 200;

interface EmpresaAttributes {
  id_user?: ParseUser;
}

interface CategoriaAttributes {
  id_empresa?: ParseObject<EmpresaAttributes>;
  imagem?: ParseFile;
  nome?: string;
}

type EmpresaObject = ParseObject<EmpresaAttributes>;
type CategoriaObject = ParseObject<CategoriaAttributes>;
type ParseObjectClass<T extends ParseObject> = {
  new (): T;
  createWithoutData(id: string): T;
};

const EmpresaModel = Parse.Object.extend("Empresa") as ParseObjectClass<EmpresaObject>;
const CategoriaModel = Parse.Object.extend("Categoria") as ParseObjectClass<CategoriaObject>;

export interface CategoriaInput {
  nome: string;
  imagem?: File | null;
}

function requireObjectId(object: ParseObject, className: string): string {
  if (!object.id) {
    throw new Error(`${className} sem identificador.`);
  }

  return object.id;
}

function mapCategoria(categoria: CategoriaObject): Categoria {
  return {
    id: requireObjectId(categoria, "Categoria"),
    nome: categoria.get("nome") ?? "",
    imagem: categoria.get("imagem")?.url() ?? "",
  };
}

async function getEmpresaForCurrentUser(): Promise<EmpresaObject | null> {
  const currentUser = Parse.User.current();
  if (!currentUser) return null;

  const query = new Parse.Query<EmpresaObject>(EmpresaModel);
  query.equalTo("id_user", currentUser);
  return (await query.first()) ?? null;
}

function requireInputId(id: string, label: string): string {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error(`${label} inválido.`);
  }

  return id;
}

async function fetchCategoriasForEmpresa(empresa: EmpresaObject): Promise<Categoria[]> {
  const query = new Parse.Query<CategoriaObject>(CategoriaModel);
  query.equalTo("id_empresa", empresa);
  query.ascending("nome");
  query.limit(LIST_LIMIT);
  query.select("nome", "imagem");

  const categorias = await query.find();
  return categorias.map(mapCategoria);
}

export async function fetchCategoriasForCurrentUser(): Promise<Categoria[]> {
  const empresa = await getEmpresaForCurrentUser();
  return empresa ? fetchCategoriasForEmpresa(empresa) : [];
}

export function fetchCategoriasByEmpresaId(empresaId: string): Promise<Categoria[]> {
  const empresa = EmpresaModel.createWithoutData(requireInputId(empresaId, "Empresa"));
  return fetchCategoriasForEmpresa(empresa);
}

export async function getCategoriaById(id: string): Promise<Categoria> {
  const categoria = await new Parse.Query<CategoriaObject>(CategoriaModel).get(
    requireInputId(id, "Categoria"),
  );
  return mapCategoria(categoria);
}

export async function createCategoria(input: CategoriaInput): Promise<Categoria> {
  const nome = input.nome.trim();
  if (!nome) throw new Error("Informe o nome da categoria.");

  const empresa = await getEmpresaForCurrentUser();
  if (!empresa) {
    throw new Error("Empresa não encontrada.");
  }

  const categoria = new CategoriaModel();
  categoria.set("id_empresa", empresa);
  categoria.set("nome", nome);

  if (input.imagem) {
    categoria.set("imagem", await uploadFile(input.imagem, "categoria.png"));
  }

  await categoria.save();
  return mapCategoria(categoria);
}

export async function updateCategoria(id: string, input: CategoriaInput): Promise<void> {
  const nome = input.nome.trim();
  if (!nome) throw new Error("Informe o nome da categoria.");

  const categoria = CategoriaModel.createWithoutData(requireInputId(id, "Categoria"));
  categoria.set("nome", nome);

  if (input.imagem) {
    categoria.set("imagem", await uploadFile(input.imagem, "categoria.png"));
  }

  await categoria.save();
}

export async function deleteCategoria(id: string): Promise<void> {
  await CategoriaModel.createWithoutData(requireInputId(id, "Categoria")).destroy();
}
