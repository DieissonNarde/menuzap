import type {
  File as ParseFile,
  Object as ParseObject,
  User as ParseUser,
} from "parse";

import type { Empresa } from "../../types/domain";
import Parse from "./client";
import { uploadFile } from "./file.service";

interface EmpresaAttributes {
  id_user?: ParseUser;
  nome?: string;
  subdominio?: string;
  logo?: ParseFile;
  cnpj?: string;
  email?: string;
  celular?: string;
  telefone?: string;
  inicioSemanaAberto?: string;
  fimSemanaAberto?: string;
  inicioHorarioNormal?: string;
  fimHorarioNormal?: string;
  inicioHorarioFeriado?: string;
  fimHorarioFeriado?: string;
  cep?: string;
  uf?: string;
  cidade?: string;
  logradouro?: string;
  bairro?: string;
  numero?: string;
}

type EmpresaObject = ParseObject<EmpresaAttributes>;

export interface UpdateEmpresaInput {
  nome: string;
  cnpj: string;
  celular: string;
  telefone: string;
  email: string;
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
  logo?: File | null;
}

function mapEmpresa(empresa: EmpresaObject): Empresa {
  if (!empresa.id) throw new Error("O Parse retornou uma empresa sem identificador.");

  return {
    id: empresa.id,
    nome: empresa.get("nome") ?? "",
    subdominio: empresa.get("subdominio") ?? "",
    logo: empresa.get("logo")?.url() ?? "",
    cnpj: empresa.get("cnpj") ?? "",
    email: empresa.get("email") ?? "",
    celular: empresa.get("celular") ?? "",
    telefone: empresa.get("telefone") ?? "",
    inicioSemanaAberto: empresa.get("inicioSemanaAberto") ?? "segunda",
    fimSemanaAberto: empresa.get("fimSemanaAberto") ?? "sexta",
    inicioHorarioNormal: empresa.get("inicioHorarioNormal") ?? "",
    fimHorarioNormal: empresa.get("fimHorarioNormal") ?? "",
    inicioHorarioFeriado: empresa.get("inicioHorarioFeriado") ?? "",
    fimHorarioFeriado: empresa.get("fimHorarioFeriado") ?? "",
    cep: empresa.get("cep") ?? "",
    uf: empresa.get("uf") ?? "",
    cidade: empresa.get("cidade") ?? "",
    logradouro: empresa.get("logradouro") ?? "",
    bairro: empresa.get("bairro") ?? "",
    numero: empresa.get("numero") ?? "",
  };
}

async function findEmpresaForCurrentUser(): Promise<EmpresaObject | null> {
  const currentUser = Parse.User.current();
  if (!currentUser) return null;

  const query = new Parse.Query<EmpresaObject>("Empresa");
  query.equalTo("id_user", currentUser);
  return (await query.first()) ?? null;
}

export async function fetchEmpresaForCurrentUser(): Promise<Empresa | null> {
  const empresa = await findEmpresaForCurrentUser();
  return empresa ? mapEmpresa(empresa) : null;
}

export async function fetchEmpresaBySubdominio(
  subdominio: string | undefined,
): Promise<Empresa | null> {
  const normalizedSubdomain = subdominio?.trim();
  if (!normalizedSubdomain) return null;

  const query = new Parse.Query<EmpresaObject>("Empresa");
  query.equalTo("subdominio", normalizedSubdomain);
  const empresa = await query.first();
  return empresa ? mapEmpresa(empresa) : null;
}

export async function updateCurrentEmpresa(input: UpdateEmpresaInput): Promise<Empresa> {
  const empresa = await findEmpresaForCurrentUser();
  if (!empresa) throw new Error("Empresa não encontrada.");

  if (input.logo) {
    empresa.set("logo", await uploadFile(input.logo, "logo.png"));
  }

  empresa.set("nome", input.nome.trim());
  empresa.set("cnpj", input.cnpj);
  empresa.set("celular", input.celular);
  empresa.set("telefone", input.telefone);
  empresa.set("email", input.email.trim());
  empresa.set("inicioSemanaAberto", input.inicioSemanaAberto);
  empresa.set("fimSemanaAberto", input.fimSemanaAberto);
  empresa.set("inicioHorarioNormal", input.inicioHorarioNormal);
  empresa.set("fimHorarioNormal", input.fimHorarioNormal);
  empresa.set("inicioHorarioFeriado", input.inicioHorarioFeriado);
  empresa.set("fimHorarioFeriado", input.fimHorarioFeriado);
  empresa.set("cep", input.cep);
  empresa.set("uf", input.uf);
  empresa.set("cidade", input.cidade);
  empresa.set("logradouro", input.logradouro);
  empresa.set("bairro", input.bairro);
  empresa.set("numero", input.numero);
  await empresa.save();

  return mapEmpresa(empresa);
}
