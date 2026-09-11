import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../components/FooterGer";
import MenuClient from "../../../components/MenuClient";
import { useCart } from "../../../hooks/useCart";
import type {
  ItemCarrinho,
  ItemCarrinhoViewModel,
} from "../../../types/domain";
import { formatPrice } from "../../../util/format";
import CartItem from "./CartItem";
import "./styles.css";

const Cart = () => {
  const navigate = useNavigate();
  const { subdominio } = useParams<{ subdominio: string }>();
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted: ItemCarrinhoViewModel[] = cart.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.preco),
    subTotal: formatPrice(product.preco * product.amount),
  }));

  const total = formatPrice(
    cart.reduce(
      (sumTotal, product) => sumTotal + product.preco * product.amount,
      0,
    ),
  );

  function handleProductIncrement(product: ItemCarrinho): void {
    void updateProductAmount({
      productId: product.id,
      amount: product.amount + 1,
    });
  }

  function handleProductDecrement(product: ItemCarrinho): void {
    void updateProductAmount({
      productId: product.id,
      amount: product.amount - 1,
    });
  }

  function handleRemoveProduct(productId: string): void {
    removeProduct(productId);
  }

  function handleCheckout(): void {
    if (subdominio) navigate(`/${subdominio}/newpedido`);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Carrinho</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <div className="cart-container">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <table className="cart-product-table">
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={4}>
                        <Typography align="center" gutterBottom variant="h5" component="h2">
                          Carrinho Vazio
                        </Typography>
                      </td>
                    </tr>
                  ) : (
                    cartFormatted.map((product) => (
                      <CartItem
                        key={product.id}
                        product={product}
                        onIncrement={handleProductIncrement}
                        onDecrement={handleProductDecrement}
                        onRemove={handleRemoveProduct}
                      />
                    ))
                  )}
                </tbody>
              </table>
              <footer>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !subdominio}
                >
                  Fazer pedido
                </button>
                <div className="cart-total">
                  <span>TOTAL</span>
                  <strong>{total}</strong>
                </div>
              </footer>
            </Grid>
          </Grid>
        </div>

        <Box sx={{ pt: 4 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
