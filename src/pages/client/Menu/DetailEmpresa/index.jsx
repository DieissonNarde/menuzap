import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import MenuClient from '../../../../components/MenuClient';
import Logo from '../../../../assets/images/lanches.jpg';
import Footer from "../../../../components/FooterGer";

const DetailEmpresa = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MenuClient>Empresa</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid className={classes.empresa} container spacing={3} justify="center">
                    <Grid item>
                      <Avatar alt="Logo Empresa" src={Logo} className={classes.large} />
                    </Grid>
                    <h3>Nome da Empresa</h3>
                  </Grid>
                  <Grid container justify="center">
                    <p className={classes.descEmp}>ABERTO</p>
                  </Grid>

                  <Grid container justify="center">
                    <h6>Horário de Funcionamento</h6>
                  </Grid>

                  <Grid container justify="center">
                    <h6>Contato</h6>
                  </Grid>

                  <Grid container justify="center">
                    <h6>Endereço</h6>
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

export default DetailEmpresa;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  paper: {padding: 28, display: 'flex', overflow: 'auto', flexDirection: 'column', },
  large: {width: theme.spacing(9), height: theme.spacing(9), },
  empresa: {alignItems: 'center', marginRight: 16, marginBottom: 0, },
  descEmp: {color: 'green', fontSize: 24, fontWeight: 'bold', marginTop: 12, },
}));