import React, { useState, useEffect } from "react";
import Parse from "parse";
import Cep from 'cep-promise';
import { Link, useParams} from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import MenuClient from "../../../../components/MenuClient";
import Footer from "../../../../components/FooterGer";
import { InputCpf, InputPhone } from "../../../../components/InputMasks";

const NewPedido = () => {
  const classes = useStyles();

  const { subdominio } = useParams();
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [tipoPagamento, setTipoPagamento] = useState('default');
  const [trocoPagamento, setTrocoPagamento] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('default');
  const [mesa, setMesa] =  useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');


  function handleCep(e) {
    const value = e.target.value;
    setCep(value);
    if (value.length === 8) {
      Cep(value)
        .then((response) => {
          setUf(response.state);
          setCidade(response.city);
          setLogradouro(response.street);
          setBairro(response.neighborhood);
        }).catch(() => {
          console.error("Erro Api Cep");
          setUf('');
          setCidade('');
          setLogradouro('');
          setBairro('');
        })
    } else {
      setUf('');
      setCidade('');
      setLogradouro('');
      setBairro('');
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
  }

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
                      Preenche o formulário de Pedido
                    </Typography>
                    <form onSubmit={handleSubmit}>
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
                          <InputCpf 
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <InputPhone 
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Select
                            id="tipo-pagamento"
                            value={tipoPagamento}
                            onChange={e => setTipoPagamento(e.target.value)}
                            fullWidth
                          >
                            <MenuItem value="default">
                              <em>Selecione o método de Pagamento</em>
                            </MenuItem>
                            <MenuItem value="dinheiro">Dinheiro</MenuItem>
                            <MenuItem value="debito">Débito</MenuItem>
                            <MenuItem value="credito">Crédito</MenuItem>
                            <MenuItem value="pix">Pix</MenuItem>
                          </Select>
                        </Grid>

                        {tipoPagamento === "dinheiro" && (
                          <Grid item xs={12}>
                            <TextField
                              required
                              type="text"
                              id="troco-pagamento"
                              name="troco-pagamento"
                              label="Troco do Pagamento"
                              fullWidth
                            />
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Select
                            id="tipo-entrega"
                            value={tipoEntrega}
                            onChange={e => setTipoEntrega(e.target.value)}
                            fullWidth
                          >
                            <MenuItem value="default">
                              <em>Selecione uma forma de Entrega</em>
                            </MenuItem>
                            <MenuItem value="mesa">Mesa</MenuItem>
                            <MenuItem value="buscar">Buscar no Local</MenuItem>
                            <MenuItem value="delivery">Delivery</MenuItem>
                          </Select>
                        </Grid>

                        {tipoEntrega === "mesa" && (
                          <Grid item xs={12}>
                            <TextField
                              required
                              id="mesa"
                              name="mesa"
                              label="Mesa"
                              fullWidth
                              autoComplete="mesa"
                            />
                          </Grid>
                        )}
                        {tipoEntrega === "buscar" && (
                          <Grid item xs={12}>
                            <TextField
                              required
                              type="number"
                              id="horas"
                              name="horas"
                              label="Horas"
                              fullWidth
                            />
                          </Grid>
                        )}
                        {tipoEntrega === "delivery" && (
                          <>
                            <Grid item xs={12}>
                              <TextField
                                type="number"
                                id="cep"
                                name="cep"
                                label="CEP"
                                value={cep}
                                onChange={handleCep}
                                fullWidth
                                autoComplete="cep"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                id="uf"
                                name="uf"
                                label="UF"
                                value={uf}
                                onChange={e => setUf(e.target.value)}
                                fullWidth
                                autoComplete="uf"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                id="cidade"
                                name="cidade"
                                label="Cidade"
                                value={cidade}
                                onChange={e => setCidade(e.target.value)}
                                fullWidth
                                autoComplete="cidade"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                id="logradouro"
                                name="logradouro"
                                label="Logradouro"
                                value={logradouro}
                                onChange={e => setLogradouro(e.target.value)}
                                fullWidth
                                autoComplete="logradouro"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                id="bairro"
                                name="bairro"
                                label="Bairro"
                                value={bairro}
                                onChange={e => setBairro(e.target.value)}
                                fullWidth
                                autoComplete="bairro"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                type="number"
                                id="numero"
                                name="numero"
                                label="Numero"
                                value={numero}
                                onChange={e => setNumero(e.target.value)}
                                fullWidth
                                autoComplete="numero"
                              />
                            </Grid>
                          </>
                        )}
                        <Grid className={classes.gridSubmit} item xs={12} sm={12}>
                          <input className={classes.submit} type="submit" value="SALVAR" />
                        </Grid>
                      </Grid>
                    </form>
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
  gridSubmit: {display: 'flex', justifyContent: 'flex-end', },
  submit: {backgroundColor: '#14bb14', color: 'white', fontSize: 16, padding: '10px 26px', border: 'none', borderRadius: 5, },
}));
