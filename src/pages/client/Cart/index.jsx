// import CartContext from '../../../context/cart/CartContext';

import React from "react";
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { makeStyles } from '@material-ui/core/styles';
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
  // const { cart, removeProduct, updateProductAmount } = useCart();

  // const cartFormatted = cart.map(product => ({
  //   // TODO
  // }))
  // const total =
  //   formatPrice(
  //     cart.reduce((sumTotal, product) => {
  //       // TODO
  //     }, 0)
  //   )

  function handleProductIncrement(product) {
    // TODO
  }

  function handleProductDecrement(handleProductIncrement) {
    // TODO
  }

  function handleRemoveProduct(productId) {
    // TODO
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
                    <tr data-testid="product">
                      <Grid item xs={12} sm={12} justify="center" className={classes.grid}>
                        <td>
                          <img
                            src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg"
                            alt="Tênis de Caminhada Leve Confortável"
                          />
                        </td>
                        <td>
                          <strong>Tênis de Caminhada Leve Confortável</strong>
                          <span>R$ 179,90</span>
                        </td>
                      </Grid>
                      <Grid container xs={12} sm={12} justify="space-between">
                      <Grid item className={classes.grid}>
                        <td>
                          <div>
                            <button
                              type="button"
                              data-testid="decrement-product"
                              // disabled={product.amount <= 1}
                              // onClick={() => handleProductDecrement()}
                            >
                              <MdRemoveCircleOutline size={20} />
                            </button>
                            <input
                              type="text"
                              data-testid="product-amount"
                              readOnly
                              value={2}
                            />
                            <button
                              type="button"
                              data-testid="increment-product"
                              // onClick={() => handleProductIncrement()}
                            >
                              <MdAddCircleOutline size={20} />
                            </button>
                          </div>
                        </td>
                      </Grid>
                      <Grid item className={classes.grid}>
                        <td>
                          <strong>R$ 359,80</strong>
                        </td>
                        <td>
                          <button
                            type="button"
                            data-testid="remove-product"
                            // onClick={() => handleRemoveProduct(product.id)}
                          >
                            <MdDelete color='red' size={20} />
                          </button>
                        </td>
                      </Grid>
                      </Grid>
                      <Divider />
                    </tr>
                  </tbody>
                </ProductTable>

                <footer>
                  <button type="button">Fazer pedido</button>
                  <Total>
                    <span>TOTAL</span>
                    <strong>R$ 359,80</strong>
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


// const { showCart, cartItems, showHideCart } = useContext(CartContext);
// <>
//     {showCart && (
//         <div className='cart__wrapper'>
//             <div style={{ textAlign: "right" }}>
//                 <i
//                     style={{ cursor: "pointer" }}
//                     className='fa fa-time-circle'
//                     aria-hidden='true'
//                     onClick={showHideCart}
//                 ></i>
//             </div>
//             <div className='cart__innerWrapper'>
//                 {cartItems.length === 0 ? (<h4>Cart is Empty</h4>) : (
//                     <ul>
//                         {cartItems.map(item => (
//                             <CartItem key={item._id} item={item} />
//                         ))}
//                     </ul>
//                 )}
//             </div>
//             <div className='Cart__cartTotal'>
//                 <div>
//                     Cart Total
//                 </div>
//                 <div></div>
//                 <div style={{ marginLeft: 5 }}>
//                     {formatPrice(cartItems.reduce((amount, item) => item.price + amount, 0))}
//                 </div>
//             </div>
//         </div>
//     )}
// </>
