import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Menu from '../../../../components/Menu';
import Button from '../../../../components/Button';
// import FormCateg from '../../../../components/FormCateg';
import Footer from '../../../../components/FooterGer';





const AddCategoria = () => {
  const classes = useStyles();

  return ( 
    <div className={classes.root}>
      <Menu>Nova Categoria</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={7} className={classes.grid}>
            <Paper className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    id="nome"
                    name="nome"
                    label="Nome"
                    fullWidth
                    autoComplete="nome"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="descricao"
                    name="descricao"
                    label="Descrição"
                    fullWidth
                    autoComplete="descricao"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
}
 
export default AddCategoria;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh',overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 25, display: 'flex', overflow: 'auto', flexDirection: 'column', alignSelf: 'center', },
}));