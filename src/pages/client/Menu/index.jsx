import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import Parse from "parse";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import MenuClient from '../../../components/MenuClient';
import CardProdutos from '../../../components/CardProdutos';
import Footer from '../../../components/FooterGer';


const Menu = () => {
  const classes = useStyles();

  const { subdominio } = useParams();
  const [value, setValue] = useState('');
  const [empresa, setEmpresa] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function loadCategorias() {
      const Empresa = Parse.Object.extend("Empresa");
      const queryEmpresa = new Parse.Query(Empresa);
      queryEmpresa.equalTo("subdominio", subdominio);
      const objectEmpresa = await queryEmpresa.first();
      const logo = objectEmpresa.get('logo');
      const nome = objectEmpresa.get('nome');
      const id = objectEmpresa.id;

      setEmpresa({
        'logo': logo._url,
        'nome': nome,
        'id': id,
      })

      const Categoria = Parse.Object.extend('Categoria');
      const query = new Parse.Query(Categoria);
      query.equalTo('id_empresa', objectEmpresa);

      await query.find().then((categorias) => {
        let response = [];
        for(const categoria of categorias) {
          // Access the Parse Object attributes using the .GET method
          const nome = categoria.get('nome');
          const id = categoria.id;

          response.push({
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
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <MenuClient>Menu</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={10} className={classes.grid}>
              <Paper className={classes.paper}>
                <Link to={`/${subdominio}/empresa`}>
                  <Grid container spacing={3} justify="center">
                    <Grid item justify="center">
                      <Avatar alt="Logo Empresa" src={empresa.logo} className={classes.logo} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography className={classes.nomeEmpresa} gutterBottom variant="h3" component="h4">
                        {empresa.nome}
                      </Typography>
                    </Grid>
                  </Grid>
                </Link>
                <Grid container justify="center">
                  <p className={classes.descEmp}>ABERTO</p>
                </Grid>
              </Paper>

              <TabContext value={value}>
                <AppBar position="static">
                  <TabList onChange={handleChange} aria-label="simple tabs example">
                    {categorias.length === 0 ? (
                      <Tab label="Default" value="" />
                    ) : (
                      categorias.map((categoria) => (
                        <Tab key={categoria.id} label={categoria.nome} value={categoria.id} />
                      ))
                    )}
                  </TabList>
                </AppBar>
                {categorias.length === 0 ? (
                  <TabPanel value="">
                    <Grid container justify="center">
                      <Typography gutterBottom variant="h5" component="h2">
                        Cardápio Vazio
                      </Typography>
                    </Grid>
                  </TabPanel>
                ) : (
                  categorias.map((categoria) => (
                    <TabPanel value={categoria.id}>
                      <CardProdutos idCategoria={categoria.id} />
                    </TabPanel>
                  ))
                )}
              </TabContext>
            </Grid>
          </Grid>
        </Container> 

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
}
 
export default Menu;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 28, display: 'flex', overflow: 'hidden', flexDirection: 'column', alignSelf: 'center', marginBottom: 14, },
  logo: {width: theme.spacing(11), height: theme.spacing(11), },
  nomeEmpresa: {color: 'black', textAlign: 'center', fontWeight: 500, },
  descEmp: {color: 'green', fontSize: 24, fontWeight: 'bold', marginTop: 12, },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
}));