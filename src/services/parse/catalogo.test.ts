import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockReadableObject {
  id?: string;
  get: (field: string) => unknown;
}

interface CatalogMockState {
  first: Record<string, MockReadableObject | undefined>;
  found: Record<string, MockReadableObject[]>;
  byId: Record<string, Record<string, MockReadableObject | undefined>>;
  constraints: Array<{ className: string; field: string; value: unknown }>;
  limits: Array<{ className: string; value: number }>;
  destroyed: Array<{ className: string; id: string | undefined }>;
}

const parseMock = vi.hoisted((): CatalogMockState => ({
  first: {},
  found: {},
  byId: {},
  constraints: [],
  limits: [],
  destroyed: [],
}));

vi.mock("./client", () => {
  class MockObject {
    id?: string;
    className: string;
    attributes: Record<string, unknown>;

    constructor(className: string, attributes: Record<string, unknown> = {}) {
      this.className = className;
      this.attributes = attributes;
    }

    get(field: string): unknown {
      return this.attributes[field];
    }

    set(field: string, value: unknown): void {
      this.attributes[field] = value;
    }

    save(): Promise<this> {
      return Promise.resolve(this);
    }

    destroy(): Promise<this> {
      parseMock.destroyed.push({ className: this.className, id: this.id });
      return Promise.resolve(this);
    }
  }

  const extend = (className: string) => class extends MockObject {
    constructor() {
      super(className);
    }

    static createWithoutData(id: string) {
      const object = new this();
      object.id = id;
      return object;
    }
  };

  class Query {
    Model: new () => MockObject;
    className: string;

    constructor(Model: new () => MockObject) {
      this.Model = Model;
      this.className = new Model().className;
    }

    equalTo(field: string, value: unknown): this {
      parseMock.constraints.push({ className: this.className, field, value });
      return this;
    }

    ascending(): this {
      return this;
    }

    limit(value: number): this {
      parseMock.limits.push({ className: this.className, value });
      return this;
    }

    select(): this {
      return this;
    }

    first(): Promise<MockReadableObject | undefined> {
      return Promise.resolve(parseMock.first[this.className]);
    }

    find(): Promise<MockReadableObject[]> {
      return Promise.resolve(parseMock.found[this.className] ?? []);
    }

    get(id: string): Promise<MockReadableObject | undefined> {
      return Promise.resolve(parseMock.byId[this.className]?.[id]);
    }
  }

  return {
    default: {
      File: class File {},
      Object: { extend },
      Query,
      User: { current: () => ({ id: "user-1" }) },
    },
  };
});

import {
  deleteCategoria,
  fetchCategoriasForCurrentUser,
} from "./categoria.service";
import { fetchProdutosByCategoriaId } from "./produto.service";

function parseObject(id: string, attributes: Record<string, unknown>): MockReadableObject {
  return {
    id,
    get: (field) => attributes[field],
  };
}

describe("serviços do catálogo", () => {
  beforeEach(() => {
    parseMock.first = {};
    parseMock.found = {};
    parseMock.byId = {};
    parseMock.constraints = [];
    parseMock.limits = [];
    parseMock.destroyed = [];
  });

  it("normaliza categorias e usa a URL pública do Parse.File", async () => {
    parseMock.first.Empresa = parseObject("empresa-1", {});
    parseMock.found.Categoria = [
      parseObject("categoria-1", {
        nome: "Bebidas",
        imagem: { url: () => "https://cdn.example/bebidas.png" },
      }),
    ];

    await expect(fetchCategoriasForCurrentUser()).resolves.toEqual([
      {
        id: "categoria-1",
        nome: "Bebidas",
        imagem: "https://cdn.example/bebidas.png",
      },
    ]);
    expect(parseMock.limits).toContainEqual({ className: "Categoria", value: 200 });
  });

  it("lista produtos com ponteiro de categoria sem buscar o objeto pai", async () => {
    parseMock.found.Produto = [
      parseObject("produto-1", {
        nome: "Suco",
        descricao: "Natural",
        preco: "12.50",
        imagem: { url: () => "https://cdn.example/suco.png" },
      }),
    ];

    await expect(fetchProdutosByCategoriaId("categoria-1")).resolves.toEqual([
      {
        id: "produto-1",
        nome: "Suco",
        descricao: "Natural",
        preco: 12.5,
        imagem: "https://cdn.example/suco.png",
      },
    ]);
    expect(parseMock.constraints).toEqual([
      expect.objectContaining({
        className: "Produto",
        field: "id_categoria",
        value: expect.objectContaining({ id: "categoria-1" }),
      }),
    ]);
    expect(parseMock.limits).toContainEqual({ className: "Produto", value: 200 });
  });

  it("remove categoria por ponteiro sem consulta de leitura", async () => {
    await deleteCategoria("categoria-1");

    expect(parseMock.destroyed).toEqual([
      { className: "Categoria", id: "categoria-1" },
    ]);
  });
});
