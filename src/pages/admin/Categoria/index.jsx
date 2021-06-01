import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

import Menu from '../../../components/Menu';
import Button from '../../../components/Button';
import Footer from '../../../components/FooterGer';


const Categoria = () => {
  const classes = useStyles();

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function loadCategorias() {
      const Empresa = Parse.Object.extend("Empresa");
      const queryEmpresa = new Parse.Query(Empresa);
      queryEmpresa.equalTo("id_user", Parse.User.current());
      const objectEmpresa = await queryEmpresa.first();

      const Categoria = Parse.Object.extend('Categoria');
      const query = new Parse.Query(Categoria);
      query.equalTo('id_empresa', objectEmpresa);

      await query.find().then((categorias) => {
        let response = [];
        for(const categoria of categorias) {
          // Access the Parse Object attributes using the .GET method
          const imagem = categoria.get('imagem');
          const nome = categoria.get('nome');
          const id = categoria.id;

          response.push({
            'imagem': imagem._url,
            'nome': nome,
            'id': id,
          })
        }

        setCategorias(response);
      },
      (error) => {
        console.error('Error while fetching Categoria', error);
      });
    }

    loadCategorias();
  }, [categorias])

  async function handleDelete(id) {
    if(window.confirm("Deseja realmente excluir esta Categoria?")) {
      const query = new Parse.Query('Categoria');
      // here you put the objectId that you want to delete
      await query.get(id).then(async (categoria) => {
        await categoria.destroy().then((response) => {
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
      <Menu>Categorias</Menu>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={4} justify="flex-end">
            <Grid item>
              <Link to="/categoria/new" >
                <Button>Nova Categoria</Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            {categorias.length < 1 ? (
                <Grid container justify="center">
                  <Typography gutterBottom variant="h5" component="h2">
                    Cardápio Vazio
                  </Typography>
                </Grid>
              ) : (
                categorias.map((categoria) => (
                  <Grid item key={categoria.id} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image={categoria.imagem}
                        title={categoria.nome}
                      />
                      <CardContent className={classes.cardContent}>
                        <Link to={"/produto/" + categoria.id}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {categoria.nome}
                          </Typography>
                        </Link>
                      </CardContent>
                      <CardActions>
                        <Link to={"/categoria/edit/" + categoria.id}>
                          <ButtonMaterial size="small" color="primary">Editar</ButtonMaterial>
                        </Link>
                        <ButtonMaterial size="small" color="secondary" onClick={() => handleDelete(categoria.id)}>
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

export default Categoria;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', }, // 16:9
  cardContent: {flexGrow: 1, },
}));