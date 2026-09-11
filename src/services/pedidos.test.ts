import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CriarPedidoInput, StatusPedido } from "../types/domain";

interface MockReadablePedido {
  id: string;
  createdAt: Date;
  get: (field: string) => unknown;
}

interface MockSavedPedido {
  id?: string;
  className: string;
  attributes: Record<string, unknown>;
}

interface MockUpdatablePedido {
  attributes: Record<string, unknown>;
  set: (field: string, value: unknown) => void;
  save: ReturnType<typeof vi.fn>;
}

const parseMock = vi.hoisted(() => ({
  empresa: null as { id: string } | null,
  pedidos: [] as MockReadablePedido[],
  equalTo: vi.fn(),
  descending: vi.fn(),
  limit: vi.fn(),
  saved: [] as MockSavedPedido[],
  byId: {} as Record<string, MockUpdatablePedido>,
}));

vi.mock("parse", () => ({
  default: {
    Object: class ParseObject {
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
        if (!this.id) this.id = "pedido-created";
        parseMock.saved.push(this);
        return Promise.resolve(this);
      }
    },
    User: { current: () => ({ id: "user-1" }) },
    Query: class Query {
      className: string;

      constructor(className: string) {
        this.className = className;
      }

      equalTo(...args: unknown[]): void {
        parseMock.equalTo(this.className, ...args);
      }

      descending(...args: unknown[]): void {
        parseMock.descending(this.className, ...args);
      }

      limit(...args: unknown[]): void {
        parseMock.limit(this.className, ...args);
      }

      first(): Promise<{ id: string } | null> {
        return Promise.resolve(parseMock.empresa);
      }

      find(): Promise<MockReadablePedido[]> {
        return Promise.resolve(parseMock.pedidos);
      }

      get(id: string): Promise<MockUpdatablePedido> {
        return Promise.resolve(parseMock.byId[id]);
      }
    },
  },
}));

import {
  createPedido,
  fetchPedidosForCurrentUser,
  updatePedidoStatus,
} from "./pedidos";

describe("fetchPedidosForCurrentUser", () => {
  beforeEach(() => {
    parseMock.empresa = null;
    parseMock.pedidos = [];
    parseMock.equalTo.mockClear();
    parseMock.descending.mockClear();
    parseMock.limit.mockClear();
    parseMock.saved = [];
    parseMock.byId = {};
  });

  it("retorna vazio quando o usuário não possui empresa", async () => {
    await expect(fetchPedidosForCurrentUser()).resolves.toEqual([]);
  });

  it("normaliza os pedidos retornados pelo Parse", async () => {
    parseMock.empresa = { id: "empresa-1" };
    parseMock.pedidos = [
      {
        id: "pedido-1",
        createdAt: new Date("2026-09-08T12:00:00Z"),
        get: (field: string) => ({
          nome: "Ana",
          cpf: "123.456.789-00",
          tipoPagamento: "pix",
          tipoEntrega: "delivery",
          valorTotal: 42.5,
          status: "novo",
        })[field],
      },
    ];

    await expect(fetchPedidosForCurrentUser()).resolves.toEqual([
      expect.objectContaining({
        id: "pedido-1",
        nome: "Ana",
        tipoPagamento: "pix",
        valorTotal: 42.5,
      }),
    ]);
    expect(parseMock.descending).toHaveBeenCalledWith("Pedido", "createdAt");
    expect(parseMock.limit).toHaveBeenCalledWith("Pedido", 1000);
  });

  it("cria um pedido normalizado e calcula o total no serviço", async () => {
    parseMock.empresa = { id: "empresa-1" };

    await expect(createPedido({
      subdominio: "minha-loja",
      cliente: { nome: " Ana ", cpf: "123", celular: "999" },
      tipoPagamento: "pix",
      trocoPagamento: "",
      tipoEntrega: "delivery",
      mesa: "",
      horas: "",
      endereco: {
        cep: "76800-000",
        uf: "RO",
        cidade: "Porto Velho",
        logradouro: "Rua A",
        bairro: "Centro",
        numero: "10",
      },
      produtos: [{
        id: "produto-1",
        nome: "Suco",
        descricao: "Natural",
        imagem: "suco.png",
        preco: 12.5,
        amount: 2,
      }],
    })).resolves.toBe("pedido-created");

    expect(parseMock.saved[0].attributes).toEqual(expect.objectContaining({
      nome: "Ana",
      tipoPagamento: "pix",
      tipoEntrega: "delivery",
      valorTotal: 25,
      status: "novo",
    }));
  });

  it("impede opções visuais inválidas de chegarem ao Parse", async () => {
    const invalidInput = {
      subdominio: "minha-loja",
      cliente: { nome: "Ana", cpf: "123", celular: "999" },
      tipoPagamento: "default",
      tipoEntrega: "delivery",
      produtos: [],
      endereco: {},
    } as unknown as CriarPedidoInput;

    await expect(createPedido(invalidInput)).rejects.toThrow("Selecione uma forma de pagamento.");
    expect(parseMock.saved).toHaveLength(0);
  });

  it("atualiza somente status reconhecidos", async () => {
    const pedido: MockUpdatablePedido = {
      attributes: {},
      set(field: string, value: unknown) {
        this.attributes[field] = value;
      },
      save: vi.fn().mockResolvedValue(undefined),
    };
    parseMock.byId["pedido-1"] = pedido;

    await updatePedidoStatus("pedido-1", "pronto");
    expect(pedido.attributes.status).toBe("pronto");
    expect(pedido.save).toHaveBeenCalledOnce();

    await expect(updatePedidoStatus("pedido-1", "desconhecido" as StatusPedido))
      .rejects.toThrow("Status de pedido inválido.");
  });
});
