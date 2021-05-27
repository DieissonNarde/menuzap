import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import MenuClient from "../../../../components/MenuClient";
import Footer from "../../../../components/FooterGer";

const NewPedido = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MenuClient>Novo Pedido</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container item xs={12} sm={6} className={classes.grid}>
            
              <Paper className={classes.paper}>
                <Grid container  justify="center" spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="h6" gutterBottom>
                      Informe seus Dados
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          required
                          id="name"
                          name="name"
                          label="Nome"
                          fullWidth
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          required
                          type="number"
                          id="cpf"
                          name="cpf"
                          label="CPF"
                          fullWidth
                          autoComplete="cpf"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          type="text"
                          id="tipo-pagamento"
                          name="tipo-pagamento"
                          label="Forma de Pagamento"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          type="text"
                          id="tipo-entrega"
                          name="tipo-entrega"
                          label="Forma de Entrega"
                          fullWidth
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          required
                          type="number"
                          id="mesa"
                          name="mesa"
                          label="Mesa"
                          fullWidth
                          autoComplete="mesa"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          type="number"
                          id="cep"
                          name="cep"
                          label="CEP"
                          fullWidth
                          autoComplete="cep"
                        />
                      </Grid>
                      
                    </Grid>
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
};

export default NewPedido;

const useStyles = makeStyles((theme) => ({
  root: { display: "flex" },
  title: { flexGrow: 1 },
  appBarSpacer: theme.mixins.toolbar,
  content: { flexGrow: 1, height: "100vh", overflow: "auto" },
  container: { paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) },
  grid: {margin: 'auto', },
  paper: {padding: theme.spacing(2), display: "flex", overflow: "auto", flexDirection: "column", },
}));
