import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (produto) => {
    try {
      const productAlreadyInCart = cart.find(product => product.id === produto.id);

      if (!productAlreadyInCart) {
        const product = produto;

        setCart([...cart, { ...product, amount: 1 }])
        localStorage.setItem('@MenuPlay:cart', JSON.stringify([...cart, { ...product, amount: 1 }]))
        return;
      }

      if (productAlreadyInCart) {
        const updatedCart = cart.map(cartItem => cartItem.id === produto.id ? {
          ...cartItem,
          amount: Number(cartItem.amount) + 1
        } : cartItem)

        setCart(updatedCart);
        localStorage.setItem('@MenuPlay:cart', JSON.stringify(updatedCart))
        return;
      }

    } catch {
      console.log('Erro na adição do produto');
    }
  };

  const removeProduct = (productId) => {
    try {
      const productExists = cart.some(cartProduct => cartProduct.id === productId);
      if (!productExists) {
        console.log('Erro na remoção do produto');
        return;
      }

      const updatedCart = cart.filter(cartItem => cartItem.id !== productId);
      setCart(updatedCart);
      localStorage.setItem('@MenuPlay:cart', JSON.stringify(updatedCart))
    } catch {
      console.log('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({ productId, amount }) => {
    try {
      if (amount < 1) {
        console.log('Erro na alteração de quantidade do produto')
        return;
      }

      const productExists = cart.some(cartProduct => cartProduct.id === productId);
      if (!productExists) {
        console.log('Erro na alteração de quantidade do produto');
        return;
      }

      const updatedCart = cart.map(cartItem => cartItem.id === productId ? {
        ...cartItem,
        amount: amount
      } : cartItem)

      setCart(updatedCart);
      localStorage.setItem('@MenuPlay:cart', JSON.stringify(updatedCart))
    } catch {
      console.log('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  return context;
}
