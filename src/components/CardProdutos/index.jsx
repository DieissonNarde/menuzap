import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Parse from "parse";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { formatPrice } from '../../util/format';

const CardProdutos = ({ value }) => {
  const classes = useStyles();

  const { subdominio } = useParams();
  const [produtos, setProdutos] = useState([]);
  const idCategoria = value;

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

  return (
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
            <Link to={`/${subdominio}/menu/item/${produto.id}`}>
              <Card key={produto.id} className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={produto.imagem}
                  title={produto.nome}
                />
                <CardContent className={classes.cardContent}>
                  <Typography
                    className={classes.title}
                    gutterBottom
                    variant="h5"
                    component="h2"
                  >
                    <span>{produto.nome}</span>
                    <span className={classes.price}>{produto.preco}</span>
                  </Typography>
                  <Typography>
                    {produto.descricao}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default CardProdutos;


const useStyles = makeStyles((theme) => ({
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', }, // 16:9
  cardContent: {flexGrow: 1, },
  title: {display: 'flex', justifyContent: 'space-between', },
  price: {fontWeight: 'bold', color: 'green', fontSize: 22, },
}));