import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockUserState {
  id: string;
  attributes: Record<string, string>;
}

interface MockEmpresaState {
  id?: string;
  attributes: Record<string, unknown>;
}

interface AuthMockState {
  empresas: MockEmpresaState[];
  loginCalls: Array<{ username: string; password: string }>;
  logoutCalls: number;
  users: MockUserState[];
  currentUser: MockUserState | null;
}

const authMock = vi.hoisted((): AuthMockState => ({
  empresas: [],
  loginCalls: [],
  logoutCalls: 0,
  users: [],
  currentUser: null,
}));

vi.mock("./client", () => {
  class MockUser {
    id = "user-1";
    attributes: Record<string, string> = {};

    set(field: string, value: string): this {
      this.attributes[field] = value;
      return this;
    }

    get(field: string): string | undefined {
      return this.attributes[field];
    }

    setUsername(value: string): this {
      return this.set("username", value);
    }

    setEmail(value: string): this {
      return this.set("email", value);
    }

    setPassword(value: string): this {
      return this.set("password", value);
    }

    getUsername(): string | undefined {
      return this.get("username");
    }

    getEmail(): string | undefined {
      return this.get("email");
    }

    authenticated(): boolean {
      return true;
    }

    signUp(): Promise<this> {
      authMock.users.push(this);
      authMock.currentUser = this;
      return Promise.resolve(this);
    }

    static logIn(username: string, password: string): Promise<MockUser> {
      authMock.loginCalls.push({ username, password });
      const user = new MockUser();
      user.set("nome", "Ana");
      user.setUsername(username);
      user.setEmail("ana@example.com");
      authMock.currentUser = user;
      return Promise.resolve(user);
    }

    static current(): MockUserState | null {
      return authMock.currentUser;
    }

    static logOut(): Promise<void> {
      authMock.logoutCalls += 1;
      authMock.currentUser = null;
      return Promise.resolve();
    }
  }

  class MockParseObject {
    id?: string;
    className: string;
    attributes: Record<string, unknown> = {};

    constructor(className: string) {
      this.className = className;
    }

    set(field: string, value: unknown): this {
      this.attributes[field] = value;
      return this;
    }

    save(): Promise<this> {
      this.id = "empresa-1";
      authMock.empresas.push(this);
      return Promise.resolve(this);
    }
  }

  return {
    default: {
      Object: MockParseObject,
      User: MockUser,
    },
  };
});

import {
  getCurrentUser,
  isCurrentUserAuthenticated,
  login,
  logout,
  registerOwner,
} from "./auth.service";

describe("serviço de autenticação", () => {
  beforeEach(() => {
    authMock.empresas = [];
    authMock.loginCalls = [];
    authMock.logoutCalls = 0;
    authMock.users = [];
    authMock.currentUser = null;
  });

  it("cria usuário e empresa com um subdomínio inicial válido", async () => {
    await expect(registerOwner({
      nome: " Loja do José ",
      username: "Jose Delivery",
      email: " jose@example.com ",
      password: "segredo",
    })).resolves.toEqual({
      id: "user-1",
      nome: "Loja do José",
      username: "Jose Delivery",
      email: "jose@example.com",
    });

    expect(authMock.empresas).toHaveLength(1);
    expect(authMock.empresas[0].attributes).toEqual(expect.objectContaining({
      nome: "Loja do José",
      email: "jose@example.com",
      subdominio: "jose-delivery",
      id_user: authMock.users[0],
    }));
  });

  it("normaliza o login e expõe somente o DTO do usuário", async () => {
    await expect(login(" ana ", "senha")).resolves.toEqual({
      id: "user-1",
      nome: "Ana",
      username: "ana",
      email: "ana@example.com",
    });
    expect(authMock.loginCalls).toEqual([{ username: "ana", password: "senha" }]);
    expect(getCurrentUser()).toEqual(expect.objectContaining({ username: "ana" }));
    expect(isCurrentUserAuthenticated()).toBe(true);

    await logout();
    expect(authMock.logoutCalls).toBe(1);
    expect(getCurrentUser()).toBeNull();
  });
});
