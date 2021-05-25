import React from 'react';
import { Link } from 'react-router-dom'
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


const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


export default function Categoria() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Menu>Categorias</Menu>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={6} justify="flex-end">
            <Grid item>
              <Link to="/categoria/new" >
                <Button>Nova Categoria</Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Link to="/produto">
                      <Typography gutterBottom variant="h5" component="h2">
                        Categoria
                      </Typography>
                    </Link>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to="/categoria/edit">
                      <ButtonMaterial size="small" color="primary">Editar</ButtonMaterial>
                    </Link>
                    <Link to="/categoria/delete">
                      <ButtonMaterial size="small" color="secondary">Remover</ButtonMaterial>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
}


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