import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';



import Menu from '../../../../components/Menu';
import Footer from '../../../../components/FooterGer';

const EditCategoria = () => {
  const history = useHistory();
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <Menu>Editar Categoria</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={7} className={classes.grid}>
            <Paper className={classes.paper}>
              <form >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="name"
                      name="name"
                      label="Nome"
                      
                      
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

export default EditCategoria;
 

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