import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

import type { ItemCarrinho, Produto } from "../types/domain";

interface UpdateProductAmountInput {
  productId: string;
  amount: number;
}

interface CartContextValue {
  cart: ItemCarrinho[];
  addProduct: (produto: Produto) => Promise<void>;
  clearCart: () => void;
  removeProduct: (productId: string) => void;
  updateProductAmount: (input: UpdateProductAmountInput) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "@MenuZap:cart";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  value: Record<string, unknown>,
  key: keyof Produto,
): string | null {
  const field = value[key];

  return typeof field === "string" ? field : null;
}

function normalizeCartItem(value: unknown): ItemCarrinho | null {
  if (!isRecord(value)) return null;

  const { id, amount, preco } = value;
  const nome = readString(value, "nome");
  const descricao = readString(value, "descricao");
  const imagem = readString(value, "imagem");

  if (
    typeof id !== "string"
    || id.trim() === ""
    || typeof amount !== "number"
    || !Number.isInteger(amount)
    || amount < 1
    || typeof preco !== "number"
    || !Number.isFinite(preco)
    || preco < 0
    || nome === null
    || descricao === null
    || imagem === null
  ) {
    return null;
  }

  return {
    id,
    nome,
    descricao,
    preco,
    imagem,
    amount,
  };
}

function readStoredCart(): ItemCarrinho[] {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart: unknown = storedCart ? JSON.parse(storedCart) : [];

    if (!Array.isArray(parsedCart)) return [];

    const cart = parsedCart.reduce<ItemCarrinho[]>((items, value) => {
      const item = normalizeCartItem(value);
      if (item) items.push(item);
      return items;
    }, []);

    return cart;
  } catch {
    return [];
  }
}

function persistCart(cart: ItemCarrinho[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Não foi possível persistir o carrinho.", error);
    }
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<ItemCarrinho[]>(readStoredCart);

  const addProduct = async (produto: Produto): Promise<void> => {
    try {
      const productAlreadyInCart = cart.find(
        (product) => product.id === produto.id,
      );

      const updatedCart = productAlreadyInCart
        ? cart.map((cartItem) => cartItem.id === produto.id
          ? { ...cartItem, amount: cartItem.amount + 1 }
          : cartItem)
        : [...cart, { ...produto, amount: 1 }];

      setCart(updatedCart);
      persistCart(updatedCart);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro na adição do produto", error);
      }
    }
  };

  const removeProduct = (productId: string): void => {
    try {
      if (!cart.some((cartProduct) => cartProduct.id === productId)) return;

      const updatedCart = cart.filter((cartItem) => cartItem.id !== productId);
      setCart(updatedCart);
      persistCart(updatedCart);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro na remoção do produto", error);
      }
    }
  };

  const clearCart = (): void => {
    setCart([]);
    persistCart([]);
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmountInput): Promise<void> => {
    try {
      if (!Number.isInteger(amount) || amount < 1) return;
      if (!cart.some((cartProduct) => cartProduct.id === productId)) return;

      const updatedCart = cart.map((cartItem) => cartItem.id === productId
        ? { ...cartItem, amount }
        : cartItem);

      setCart(updatedCart);
      persistCart(updatedCart);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro na alteração de quantidade do produto", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, clearCart, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}
