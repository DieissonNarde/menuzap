import type { CadastroUsuarioInput, Usuario } from "../../types/domain";
import Parse from "./client";

interface UserAttributes {
  nome?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface EmpresaAttributes {
  id_user?: Parse.User<UserAttributes>;
  nome?: string;
  email?: string;
  subdominio?: string;
}

function requireUserId(user: Parse.User<UserAttributes>): string {
  if (!user.id) throw new Error("O Parse retornou um usuário sem identificador.");
  return user.id;
}

function mapUsuario(user: Parse.User<UserAttributes>): Usuario {
  return {
    id: requireUserId(user),
    nome: user.get("nome") ?? "",
    username: user.getUsername() ?? user.get("username") ?? "",
    email: user.getEmail() ?? user.get("email") ?? "",
  };
}

function createInitialSubdomain(username: string): string {
  const subdominio = username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!subdominio) throw new Error("O nome de usuário não gera um subdomínio válido.");
  return subdominio;
}

export async function login(username: string, password: string): Promise<Usuario> {
  const user = await Parse.User.logIn<Parse.User<UserAttributes>>(
    username.trim(),
    password,
  );
  return mapUsuario(user);
}

export async function logout(): Promise<void> {
  await Parse.User.logOut();
}

export function getCurrentUser(): Usuario | null {
  const user = Parse.User.current<Parse.User<UserAttributes>>();
  return user ? mapUsuario(user) : null;
}

export function isCurrentUserAuthenticated(): boolean {
  const user = Parse.User.current<Parse.User<UserAttributes>>();
  return Boolean(user?.authenticated());
}

export async function registerOwner(input: CadastroUsuarioInput): Promise<Usuario> {
  const nome = input.nome.trim();
  const username = input.username.trim();
  const email = input.email.trim();

  if (!nome || !username || !email || !input.password) {
    throw new Error("Preencha todos os dados obrigatórios do cadastro.");
  }

  const user = new Parse.User<UserAttributes>();
  user.set("nome", nome);
  user.setUsername(username);
  user.setEmail(email);
  user.setPassword(input.password);
  await user.signUp();

  const empresa = new Parse.Object<EmpresaAttributes>("Empresa");
  empresa.set("id_user", user);
  empresa.set("nome", nome);
  empresa.set("email", email);
  empresa.set("subdominio", createInitialSubdomain(username));

  try {
    await empresa.save();
  } catch (error) {
    throw new Error(
      "O usuário foi criado, mas não foi possível criar a empresa. Entre em contato com o suporte.",
      { cause: error },
    );
  }

  return mapUsuario(user);
}
