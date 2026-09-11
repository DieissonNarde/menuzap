import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline,
} from "react-icons/md";

import type {
  ItemCarrinho,
  ItemCarrinhoViewModel,
} from "../../../types/domain";

interface CartItemProps {
  product: ItemCarrinhoViewModel;
  onIncrement: (product: ItemCarrinho) => void;
  onDecrement: (product: ItemCarrinho) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({
  product,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) => (
  <tr data-testid="product">
    <td className="cart-product-image">
      <img src={product.imagem} alt={product.nome} />
    </td>
    <td className="cart-product-details">
      <strong>{product.nome}</strong>
      <span>{product.priceFormatted}</span>
    </td>
    <td className="cart-product-quantity">
      <div>
        <button
          type="button"
          data-testid="decrement-product"
          disabled={product.amount <= 1}
          onClick={() => onDecrement(product)}
          aria-label={`Diminuir quantidade de ${product.nome}`}
        >
          <MdRemoveCircleOutline size={20} />
        </button>
        <input
          type="text"
          data-testid="product-amount"
          readOnly
          value={product.amount}
          aria-label="Quantidade"
        />
        <button
          type="button"
          data-testid="increment-product"
          onClick={() => onIncrement(product)}
          aria-label={`Aumentar quantidade de ${product.nome}`}
        >
          <MdAddCircleOutline size={20} />
        </button>
      </div>
    </td>
    <td className="cart-product-subtotal">
      <strong>{product.subTotal}</strong>
      <button
        type="button"
        data-testid="remove-product"
        onClick={() => onRemove(product.id)}
        aria-label={`Remover ${product.nome}`}
      >
        <MdDelete color="red" size={20} />
      </button>
    </td>
  </tr>
);

export default CartItem;
