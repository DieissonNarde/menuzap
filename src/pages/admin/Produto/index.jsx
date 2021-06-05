import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Parse from "parse";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ButtonMaterial from '@material-ui/core/Button';

import { formatPrice } from '../../../util/format';
import Menu from '../../../components/Menu';
import Button from '../../../components/Button';
import Footer from '../../../components/FooterGer';


const Produto = () => {
  const classes = useStyles();

  const { idCategoria } = useParams();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function loadProdutos() {
      const Categoria = Parse.Object.extend('Categoria');
      const queryCategoria = new Parse.Query(Categoria);
      const objectCategoria = await queryCategoria.get(idCategoria);

      const Produto = Parse.Object.extend('Produto');
      const query = new Parse.Query(Produto);
      query.equalTo('id_categoria', objectCategoria);

      await query.find().then((produtos) => {
        let response = [];
        for(const produto of produtos) {
          // Access the Parse Object attributes using the .GET method
          const imagem = produto.get('imagem');
          const nome = produto.get('nome');
          const descricao = produto.get('descricao');
          const preco = produto.get('preco');
          const id = produto.id;

          response.push({
            'imagem': imagem._url,
            'nome': nome,
            'descricao': descricao,
            'preco': formatPrice(preco),
            'id': id,
          })
        }

        setProdutos(response);
      },
      (error) => {
        console.error('Error while fetching Produto', error);
      });
    }

    loadProdutos();
  }, [produtos])

  async function handleDelete(id) {
    if(window.confirm("Deseja realmente excluir este Produto?")) {
      const query = new Parse.Query('Produto');
      // here you put the objectId that you want to delete
      await query.get(id).then(async (produto) => {
        await produto.destroy().then((response) => {
          console.log('Deleted ParseObject', response);
        },
        (error) => {
          alert("Não foi possível fazer a exclusão da categoria. Tente novamente!");
          console.error('Error while deleting ParseObject', error);
        })
          
      },
      (err) => {
        console.error('Error while retrieving ParseObject', err);
      });
    }
  }

  return (
    <div className={classes.root}>
      <Menu>Produtos</Menu>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3} justify="flex-end">
            <Grid item>
              <Link to={`/categoria/${idCategoria}/produto/new/`}>
                <Button>Novo Produto</Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {produtos.length === 0 ? (
                <Grid container justify="center">
                  <Typography gutterBottom variant="h5" component="h2">
                    Categoria Vazia
                  </Typography>
                </Grid>
              ) : (
                produtos.map((produto) => (
                  <Grid item key={produto.id} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={produto.imagem}
                        title={produto.nome}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography className={classes.title} gutterBottom variant="h5" component="h2">
                          <span>{produto.nome}</span><span className={classes.price}>{produto.preco}</span>
                        </Typography>
                        <Typography>
                          {produto.descricao}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Link to={`/categoria/${idCategoria}/produto/edit/${produto.id}`}>
                          <ButtonMaterial size="small" color="primary">Editar</ButtonMaterial>
                        </Link>
                        <ButtonMaterial size="small" color="secondary" onClick={() => handleDelete(produto.id)}>
                          Remover
                        </ButtonMaterial>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )
            }
          </Grid>
        </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
}

export default Produto;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', }, // 16:9
  cardContent: {flexGrow: 1, },
  title: {display: 'flex', justifyContent: 'space-between', },
  price: {fontWeight: 'bold', },
}));