import React from 'react';
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Menu from '../../../components/Menu';
import Button from '../../../components/Button';
import FormAdd from '../../../components/FormAdd';
import Footer from '../../../components/FooterGer';



export default function AddCategoria() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Menu>Adicionar Nova Categoria</Menu>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={6} justify="flex-end">
            <Grid item>
              <Link to="/categoria" >
                <Button>Voltar para Categorias</Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <FormAdd />
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
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));