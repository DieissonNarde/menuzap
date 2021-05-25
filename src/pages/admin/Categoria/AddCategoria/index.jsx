import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Parse from '../../../../services/api';

import Menu from '../../../../components/Menu';
import Footer from '../../../../components/FooterGer';

export default function AddCategoria() {
  const history = useHistory();
  const classes = useStyles();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    const data = {
      'name': name,
      'price': parseInt(price),
      'color': color,
    }

    const B4aVehicle = Parse.Object.extend('B4aVehicle');
    const myNewObject = new B4aVehicle();

    myNewObject.set(data);

    await myNewObject.save().then(
      (result) => {
        history.push('/categoria');
      },
      (error) => {
        alert('Infelizmente não foi possível salvar na base de dados, tente novamente. Erro: ', error);
        console.error('Error while creating Categoria: ', error);
      }
    );
  }

  return (
    <div className={classes.root}>
      <Menu>Nova Categoria</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={7} className={classes.grid}>
            <Paper className={classes.paper}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Nome"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      fullWidth
                      autoComplete="nome"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      type="number"
                      id="price"
                      name="price"
                      label="Preço"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      fullWidth
                      autoComplete="preco"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="color"
                      name="color"
                      label="Cor"
                      value={color}
                      onChange={e => setColor(e.target.value)}
                      fullWidth
                      autoComplete="cor"
                    />
                  </Grid>
                  <Grid className={classes.gridSubmit} item xs={12} sm={12}>
                    <input className={classes.submit} type="submit" value="SALVAR" />
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  )
}
 

const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 25, display: 'flex', overflow: 'auto', flexDirection: 'column', alignSelf: 'center', },
  gridSubmit: {display: 'flex', justifyContent: 'flex-end', },
  submit: {backgroundColor: '#14bb14', color: 'white', fontSize: '16px', padding: '10px 26px', border: 'none', borderRadius: '5px', },
}));