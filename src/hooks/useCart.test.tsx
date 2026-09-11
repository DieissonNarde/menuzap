// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Produto } from "../types/domain";
import { CartProvider, useCart } from "./useCart";

const wrapper = ({ children }: PropsWithChildren) => <CartProvider>{children}</CartProvider>;

const product: Produto = {
  id: "p-1",
  nome: "Produto",
  descricao: "Descrição",
  preco: 10,
  imagem: "https://example.com/produto.png",
};

describe("useCart", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("lê a chave atual e persiste alterações na mesma chave", async () => {
    localStorage.setItem("@MenuZap:cart", JSON.stringify([{ ...product, amount: 2 }]));

    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart[0].amount).toBe(2);

    await act(async () => {
      await result.current.addProduct(product);
    });

    expect(result.current.cart[0].amount).toBe(3);
    expect(JSON.parse(localStorage.getItem("@MenuZap:cart") ?? "[]")[0].amount).toBe(3);
  });

  it("descarta itens inválidos armazenados por código externo", () => {
    localStorage.setItem(
      "@MenuZap:cart",
      JSON.stringify([
        { ...product, amount: 1 },
        { ...product, id: "", amount: 1 },
        { ...product, id: "preco-invalido", preco: "10", amount: 1 },
        null,
      ]),
    );

    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([{ ...product, amount: 1 }]);
  });

  it("limpa o estado e o armazenamento depois de finalizar o pedido", () => {
    localStorage.setItem("@MenuZap:cart", JSON.stringify([{ ...product, amount: 1 }]));
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toEqual([]);
    expect(JSON.parse(localStorage.getItem("@MenuZap:cart") ?? "[]")).toEqual([]);
  });

  it("falha claramente quando usado fora do provider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart deve ser usado dentro de CartProvider.",
    );
  });
});
