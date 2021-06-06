import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from "@material-ui/core/Divider";

import MenuClient from '../../../components/MenuClient';
import Footer from "../../../components/FooterGer";

import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../util/format';
import { Container, ProductTable, Total } from './styles';

const Cart = () => {
  const classes = useStyles();
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => ({
    ...product, priceFormatted: formatPrice(product.preco), subTotal: formatPrice(product.preco * product.amount)
  }))

  const total =
    formatPrice(
      cart.reduce((sumTotal, product) => {
        sumTotal += product.preco * product.amount

        return sumTotal;
      }, 0)
    )

  function handleProductIncrement(product) {
    const IncrementArguments = {
      productId: product.id,
      amount: product.amount + 1
    }
    updateProductAmount(IncrementArguments);
  }

  function handleProductDecrement(product) {
    const DecrementArguments = {
      productId: product.id,
      amount: product.amount - 1
    }
    updateProductAmount(DecrementArguments);
  }

  function handleRemoveProduct(productId) {
    removeProduct(productId);
  }

  return (
    <div className={classes.root}>
      <MenuClient>Carrinho</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <ProductTable>
                  <tbody>
                    {cart.length === 0 ? (
                      <Grid container justify="center">
                        <Typography gutterBottom variant="h5" component="h2">
                          Carrinho Vazio
                        </Typography>
                      </Grid>
                    ) : (
                      cartFormatted.map(product => (
                        <tr data-testid="product" key={product.id}>
                          <Grid item xs={12} sm={12} justify="center" className={classes.grid}>
                            <td>
                              <img
                                src={product.imagem}
                                alt={product.nome}
                              />
                            </td>
                            <td>
                              <strong>{product.nome}</strong>
                              <span>{product.priceFormatted}</span>
                            </td>
                          </Grid>
                          <Grid container xs={12} sm={12} justify="space-between">
                            <Grid item className={classes.grid}>
                              <td>
                                <div>
                                  <button
                                    type="button"
                                    data-testid="decrement-product"
                                    disabled={product.amount <= 1}
                                    onClick={() => handleProductDecrement(product)}
                                  >
                                    <MdRemoveCircleOutline size={20} />
                                  </button>
                                  <input
                                    type="text"
                                    data-testid="product-amount"
                                    readOnly
                                    value={product.amount}
                                  />
                                  <button
                                    type="button"
                                    data-testid="increment-product"
                                    onClick={() => handleProductIncrement(product)}
                                  >
                                    <MdAddCircleOutline size={20} />
                                  </button>
                                </div>
                              </td>
                            </Grid>
                            <Grid item className={classes.grid}>
                              <td>
                                <strong>{product.subTotal}</strong>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  data-testid="remove-product"
                                  onClick={() => handleRemoveProduct(product.id)}
                                >
                                  <MdDelete color='red' size={20} />
                                </button>
                              </td>
                            </Grid>
                          </Grid>
                          <Divider />
                        </tr>
                      ))
                    )}
                  </tbody>
                </ProductTable>
                <footer>
                  <button type="button">Fazer pedido</button>
                  <Total>
                    <span>TOTAL</span>
                    <strong>{total}</strong>
                  </Total>
                </footer>
              </Grid>
            </Grid>
          </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
};

export default Cart;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 0, },
}));