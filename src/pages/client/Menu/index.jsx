import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom'
import Parse from "parse";
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import MenuClient from '../../../components/MenuClient';
import Logo from '../../../assets/images/lanches.jpg';
import Footer from '../../../components/FooterGer';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  console.log('index: ', index);
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const Menu = () => {
  const classes = useStyles();

  const { subdominio } = useParams();
  const [value, setValue] = useState('');
  const [empresa, setEmpresa] = useState([]);
  const [categorias, setCategorias] = useState([]);
  let i = 0;

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
    console.log('value: ', newValue);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <MenuClient>Menu</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Paper className={classes.paper}>
            <Grid className={classes.empresa} container spacing={3} justify="center">
              <Grid item>
                <Avatar alt="Logo Empresa" src={empresa.logo} className={classes.large} />
              </Grid>
              <h3>{empresa.nome}</h3>
            </Grid>
            <Grid container justify="center">
              <p className={classes.descEmp}>ABERTO</p>
            </Grid>
          </Paper>

          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {categorias.length === 0 ? (
                <Tab label="Default" {...a11yProps(0)} />
              ) : (
                categorias.map((categoria) => (
                  <Tab label={categoria.nome} {...a11yProps(categoria.id)} />
                ))
              )}
            </Tabs>
          </AppBar>
          <Grid container spacing={3}>
          {categorias.length === 0 ? (
            <TabPanel value={value} index={0}>
              <Grid container justify="center">
                <Typography gutterBottom variant="h5" component="h2">
                  Cardápio Vazio
                </Typography>
              </Grid>
            </TabPanel>
          ) : (
            categorias.map((categoria) => (
              <TabPanel value={categoria.id} index={categoria.id}>
                <h1>{categoria.nome}</h1>
              </TabPanel>
            ))
          )}
          </Grid>

          {/* <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.title}
                      gutterBottom
                      variant="h5"
                      component="h2"
                    >
                      <span>Produto</span>
                      <span className={classes.price}>R$ 53,99</span>
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to
                      describe the content.
                    </Typography>
                  </CardContent>
                  
                </Card>
              </Grid>
            ))}
          </Grid>*/}
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
  paper: {padding: 28, display: 'flex', overflow: 'auto', flexDirection: 'column', alignSelf: 'center', marginBottom: 14, },
  large: {width: theme.spacing(9), height: theme.spacing(9), },
  empresa: {alignItems: 'center', marginRight: 16, marginBottom: 0, },
  descEmp: {color: 'green', fontSize: 24, fontWeight: 'bold', marginTop: 12, },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', }, // 16:9
  cardContent: {flexGrow: 1, },
  title: {display: 'flex', justifyContent: 'space-between', },
  price: {fontWeight: 'bold', color: 'green', fontSize: 22, },
}));