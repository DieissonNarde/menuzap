import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MenuClient from '../../../components/MenuClient';
import Footer from "../../../components/FooterGer";

const Pedidos = () => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <MenuClient>Pedidos</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={4}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>

                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography className={classes.heading}>Data</Typography>
                        <Typography className={classes.secondaryHeading}>Status do Pedido</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          Lista de Produtos
                        </Typography>
                        <Typography>
                          Tipo Pagmento | Tipo Entrega
                        </Typography>
                        <Typography>
                          Valor Total
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                      >
                        <Typography className={classes.heading}>Data</Typography>
                        <Typography className={classes.secondaryHeading}>
                          Status do Pedido
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          Lista de Produtos
                        </Typography>
                        <Typography>
                          Tipo Pagamento | Tipo Entrega
                        </Typography>
                        <Typography>
                          Valor Total
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
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
};

export default Pedidos;

   {/* {pedidos.map((pedido) => {
                            if (pedido.status === { relatorio }) {
                              <TableRow key={pedido.id}>
                                <TableCell component="th" scope="row">
                                  {pedido.nome}
                                </TableCell>
                                <TableCell align="center">
                                  {pedido.cpf}
                                </TableCell>
                                <TableCell align="center">
                                  {pedido.tipoPagamento}
                                </TableCell>
                                <TableCell align="center">
                                  {pedido.valorTotal}
                                </TableCell>
                                <TableCell align="right">
                                  {new Date(pedido.createdAt).toLocateString(
                                    "pt-br"
                                  )}
                                </TableCell>
                              </TableRow>;
                            }
                          })} */}


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  paper: {padding: theme.spacing(2), display: 'flex', overflow: 'auto', flexDirection: 'column', },
  heading: {fontSize: theme.typography.pxToRem(15), flexBasis: '33.33%', flexShrink: 0, },
  secondaryHeading: {fontSize: theme.typography.pxToRem(15), color: theme.palette.text.secondary, },
}));