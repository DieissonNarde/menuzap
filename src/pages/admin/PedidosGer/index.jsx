import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Menu from '../../../components/Menu';
import Footer from "../../../components/FooterGer";


const PedidosGer = () => {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  const [pedidos, setPedidos] = useState([]);
  

  // useEffect(() => {

  //   async function loadPedidos() {
  //     const response = await api.get("/api/pedidos");

  //     setPedidos(response.data);
  //   }
  //   loadPedidos();
  // }, [])

  function handleUpdateStatus(event) {
    const status = event.target.value;


  }

  return (
    <div className={classes.root}>
      <Menu>Pedidos dos Clientes</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={4}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TableContainer component={Paper}>
                      <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell align="right">CPF</TableCell>
                            <TableCell align="right">Tipo Pagamento</TableCell>
                            <TableCell align="right">Tipo Entrega</TableCell>
                            <TableCell align="right">Valor Total</TableCell>
                            <TableCell align="right">STATUS</TableCell>
                            <TableCell align="right">Data</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pedidos.map((pedido) => {
                            if(pedido.status !== "finalizado") {
                              <TableRow key={pedido.id}>
                                <TableCell component="th" scope="row">
                                  {pedido.nome}
                                </TableCell>
                                <TableCell align="center">{pedido.cpf}</TableCell>
                                <TableCell align="center">{pedido.tipoPagamento}</TableCell>
                                <TableCell align="center">{pedido.tipoEntrega}</TableCell>
                                <TableCell align="center">{pedido.valorTotal}</TableCell>
                                <TableCell align="center">
                                  <Select
                                    id="pedido-status"
                                    value={pedido.status}
                                    onChange={handleUpdateStatus}
                                    fullWidth
                                  >
                                    <MenuItem value="novo">Novo</MenuItem>
                                    <MenuItem value="em andamento">Em andamento</MenuItem>
                                    <MenuItem value="pronto">Pronto</MenuItem>
                                    <MenuItem value="em transporte">Em transporte</MenuItem>
                                    <MenuItem value="finalizado">Finalizado</MenuItem>
                                  </Select>
                                </TableCell>
                                <TableCell align="right">{new Date(pedido.createdAt).toLocateString('pt-br')}</TableCell>
                              </TableRow>
                            }
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>
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

export default PedidosGer;



const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  paper: {padding: theme.spacing(2), display: 'flex', overflow: 'auto', flexDirection: 'column', },
  fixedHeight: {height: 240, },
}));