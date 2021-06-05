import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Parse from "parse";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import Menu from '../../../../components/Menu';
import Footer from '../../../../components/FooterGer';


const EditProduto = () => {
  const classes = useStyles();

  const history = useHistory();
  const { idCategoria, idProduto } = useParams();

  const [file, setFile] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');

  useEffect(() => {
    async function getProduto() {
      const Produto = Parse.Object.extend('Produto');
      const query = new Parse.Query(Produto);
      // here you put the objectId that you want to update
      const produto = await query.get(idProduto);

      setNome(produto.get('nome'));
      setDescricao(produto.get('descricao'));
      setPreco(produto.get('preco'));
    }
    
    getProduto();
  }, [])

  function handleChange(e) {
    if(e.target.files.length > 0) {
      let eventFile = e.target.files[0];
      setFile(eventFile);
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    
    const Produto = Parse.Object.extend('Produto');
    const query = new Parse.Query(Produto);
    // here you put the objectId that you want to update
    const produto = await query.get(idProduto);

    if(file !== '') {
      const name = "imagem.png";
      const parseFile = new Parse.File(name, file);
      await parseFile.save().then(() => {
          produto.set('imagem', parseFile);
        },
        (err) => {
          // The file either could not be read, or could not be saved to Parse.
          alert('Infelizmente não foi possível salvar a imagem na base de dados, tente novamente. Erro: ', err);
          console.error('Not be sabed to Parse: ', err);
        }
      );
    }

    produto.set('nome', nome);
    produto.set('descricao', descricao);
    produto.set('preco', preco);
      
    await produto.save().then(() => {
        history.push(`/categoria/${idCategoria}/produto/`);
      },
      (error) => {
        alert('Infelizmente não foi possível salvar na base de dados, tente novamente. Erro: ', error);
        console.error('Error while update Produto: ', error);
      }
    );
  }

  return (
    <div className={classes.root}>
      <Menu>Editar Produto</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={7} className={classes.grid}>
            <Paper className={classes.paper}>
              <form onSubmit={handleSubmit} method="POST">
                <Grid container spacing={3}>
                <Grid container justify="center">
                    <label htmlFor="icon-button-file2">
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    <input accept="image/*" onChange={handleChange} className={classes.input} id="icon-button-file2" type="file" />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Nome"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      fullWidth
                      autoComplete="name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="description"
                      name="description"
                      label="Descrição"
                      value={descricao}
                      onChange={e => setDescricao(e.target.value)}
                      fullWidth
                      autoComplete="description"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="preco"
                      name="preco"
                      label="Preço"
                      value={preco}
                      onChange={e => setPreco(e.target.value)}
                      fullWidth
                      autoComplete="preco"
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

export default EditProduto;
 

const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  input: {marginTop: 10, color: '#A9A9A9', },
  paper: {padding: 25, display: 'flex', overflow: 'auto', flexDirection: 'column', alignSelf: 'center', },
  gridSubmit: {display: 'flex', justifyContent: 'flex-end', },
  submit: {backgroundColor: '#14bb14', color: 'white', fontSize: '16px', padding: '10px 26px', border: 'none', borderRadius: '5px', },
}));