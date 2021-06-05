import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Parse from "parse";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import MenuClient from '../../../../components/MenuClient';
import Footer from "../../../../components/FooterGer";

const DetailEmpresa = () => {
  const classes = useStyles();

  const { subdominio } = useParams();
  const [empresa, setEmpresa] = useState([]);

  useEffect(() => {
    async function loadCategorias() {
      const Empresa = Parse.Object.extend("Empresa");
      const query = new Parse.Query(Empresa);
      query.equalTo("subdominio", subdominio);
      const empresa = await query.first();

      const logo = empresa.get('logo');
      const nome = empresa.get('nome');
      const cnpj = empresa.get('cnpj');
      const email = empresa.get('email');
      const celular = empresa.get('celular');
      const telefone = empresa.get('telefone');
      const inicioSemanaAberto = empresa.get('inicioSemanaAberto');
      const fimSemanaAberto = empresa.get('fimSemanaAberto');
      const inicioHorarioNormal = empresa.get('inicioHorarioNormal');
      const fimHorarioNormal = empresa.get('fimHorarioNormal');
      const inicioHorarioFeriado = empresa.get('inicioHorarioFeriado');
      const fimHorarioFeriado = empresa.get('fimHorarioFeriado');
      const cep = empresa.get('cep');
      const uf = empresa.get('uf');
      const cidade = empresa.get('cidade');
      const logradouro = empresa.get('logradouro');
      const bairro = empresa.get('bairro');
      const numero = empresa.get('numero');
      const id = empresa.id;

      setEmpresa({
        'logo': logo._url,
        'nome': nome,
        'cnpj': cnpj,
        'email': email,
        'celular': celular,
        'telefone': telefone,
        'inicioSemanaAberto': inicioSemanaAberto,
        'fimSemanaAberto': fimSemanaAberto,
        'inicioHorarioNormal': inicioHorarioNormal,
        'fimHorarioNormal': fimHorarioNormal,
        'inicioHorarioFeriado': inicioHorarioFeriado,
        'fimHorarioFeriado': fimHorarioFeriado,
        'cep': cep,
        'uf': uf,
        'cidade': cidade,
        'logradouro': logradouro,
        'bairro': bairro,
        'numero': numero,
        'id': id,
      })
    }

    loadCategorias();
  }, [empresa])

  return (
    <div className={classes.root}>
      <MenuClient>Empresa</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8} className={classes.grid}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid container spacing={3} justify="center">
                    <Grid item justify="center">
                      <Avatar alt={"Logo " + empresa.nome} src={empresa.logo} className={classes.logo} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.nomeEmpresa} gutterBottom variant="h3" component="h4">
                        {empresa.nome}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container justify="center">
                    <p className={classes.descEmp}>ABERTO</p>
                  </Grid>

                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <Typography className={classes.tituloEmpresa} gutterBottom variant="h5" component="h2">
                        HORÁRIO DE FUNCIONAMENTO
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.inicioSemanaAberto} à {empresa.fimSemanaAberto}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.inicioHorarioNormal} às {empresa.fimHorarioNormal}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography className={classes.tituloEmpresa} gutterBottom variant="h5" component="h2">
                        FERIADO
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.inicioHorarioFeriado} às {empresa.fimHorarioFeriado}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography className={classes.tituloEmpresa} gutterBottom variant="h5" component="h2">
                        CONTATO
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.celular} / {empresa.telefone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.email}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography className={classes.tituloEmpresa} gutterBottom variant="h5" component="h2">
                        ENDEREÇO
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.cidade} / {empresa.uf}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.logradouro}, {empresa.bairro} - {empresa.numero}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.dadosEmpresa} gutterBottom variant="h6" component="h6">
                        {empresa.cep}
                      </Typography>
                    </Grid>
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
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 28, display: 'flex', overflow: 'auto', flexDirection: 'column', },
  logo: {width: theme.spacing(15), height: theme.spacing(15), },
  nomeEmpresa: {textAlign: 'center', fontWeight: 'bold', },
  descEmp: {color: 'green', fontSize: 24, fontWeight: 'bold', marginTop: 12, },
  tituloEmpresa: {marginTop: 15, color: 'black', fontWeight: 500, textAlign: 'center', },
  dadosEmpresa: {color: '#A9A9A9', textAlign: 'center', },
}));