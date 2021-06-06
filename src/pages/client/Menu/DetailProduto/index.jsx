import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import Parse from "parse";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

// import CartContext from '../../../../context/cart/CartContext';
import { useCart } from '../../../../hooks/useCart';
import { formatPrice } from '../../../../util/format';
import MenuClient from '../../../../components/MenuClient';
import Footer from "../../../../components/FooterGer";

const DetailProduto = () => {
  const classes = useStyles();

  const { subdominio, id } = useParams();
  const [produto, setProduto] = useState({});
  // const { addToCart } = useContext(CartContext);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {

  }, {})

  useEffect(() => {
    async function loadProduto() {
      const Produto = Parse.Object.extend('Produto');
      const query = new Parse.Query(Produto);
      const produto = await query.get(id);

      const imagem = produto.get('imagem');
      const nome = produto.get('nome');
      const descricao = produto.get('descricao');
      const preco = produto.get('preco');

      setProduto({
        'imagem': imagem._url,
        'nome': nome,
        'descricao': descricao,
        'preco': formatPrice(preco),
      })
    }

    loadProduto();
  }, [produto])

  function handleAddProduct(id) {
    // TODO
  }

  return (
    <div className={classes.root}>
      <MenuClient>Produto</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={9} className={classes.grid}>
              <Paper className={classes.paper}>
                <Grid container spacing={3} justify="start">
                  <Grid item xs={12} sm={12}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={produto.imagem}
                      title={produto.nome}
                    />
                  </Grid>
                  <CardContent className={classes.cardContent}>
                    <Grid item xs={12} sm={12}>
                      <Typography
                        className={classes.title}
                        gutterBottom
                        variant="h3"
                        component="h3"
                      >
                        {produto.nome}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <p className={classes.descricao}>{produto.descricao}</p>
                    </Grid>
                  </CardContent>
                  <Grid container xs={12} sm={12} justify="space-between">
                    <span className={classes.price}>{produto.preco}</span>
                    <Button onClick={() => handleAddProduct(produto.id)} size="large" variant="contained" color="primary">Add ao Carrinho</Button>
                  </Grid>
                    
                    
                    {/* <Grid className={classes.acrecimos} item xs={12} sm={6}>
                      <Divider />
                      <Typography
                        className={classes.title}
                        gutterBottom
                        variant="h5"
                        component="h4"
                      >
                        Acrécimos
                      </Typography>
                      <Paper >
                        <Grid container>
                          <Grid item xs={6} sm={6}>
                            <Typography
                              className={classes.title}
                              gutterBottom
                              variant="h6"
                              component="h4"
                            >
                              Salada
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Typography
                              className={classes.priceAcr}
                              gutterBottom
                              variant="h6"
                              component="h4"
                            >
                              + R$ 3,20
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid> */}
                </Grid>
              </Paper>
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

export default DetailProduto;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 28, display: 'flex', overflow: 'auto', flexDirection: 'column', },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', borderRadius: 20, }, // 16:9
  cardContent: {display: 'flex', flexDirection: 'column', },
  title: {textAlign: 'center', fontWeight: 500, fontSize: 32, },
  descricao: {fontSize: 18, },
  price: {fontWeight: 'bold', marginLeft: 12, color: 'green', fontSize: 28, },
  button: { },
  priceAcr: {fontWeight: 'bold', color: 'green', fontSize: 18, textAlign: 'end', },
  acrecimos: {marginTop: 20, },
}));