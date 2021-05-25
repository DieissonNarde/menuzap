import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Parse from '../../../services/api';

import Menu from '../../../components/Menu';
import Footer from '../../../components/FooterGer';


const Profile = () => {
  const history = useHistory();
  const classes = useStyles();

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [diasSemanaAberto, setDiasSemanaAberto] = useState('');
  const [horarioNormal, setHorarioNormal] = useState('');
  const [horarioFeriado, setHorarioFeriado] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  
  async function handleSubmit(ev) {
    ev.preventDefault();

    const data = {
      'nome': nome,
      'cnpj': cnpj,
      'email': email,
      'celular': celular,
      'dias_semana_aberto': diasSemanaAberto,
      'horario_normal': horarioNormal,
      'horario_feriado': horarioFeriado,
      'cep': cep,
      'uf': uf,
      'cidade': cidade,
      'logradouro': logradouro,
      'bairro': bairro,
      'numero': numero,
    }

    const B4aVehicle = Parse.Object.extend('B4aVehicle');
    const myNewObject = new B4aVehicle();

    myNewObject.set(data);

    await myNewObject.save().then(
      (result) => {
        history.push('/dashboard');
      },
      (error) => {
        alert('Infelizmente não foi possível salvar na base de dados, tente novamente. Erro: ', error);
        console.error('Error while creating Minha Conta: ', error);
      }
    );
  }

  return ( 
    <div className={classes.root}>
      <Menu>Minha Conta</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={10} className={classes.grid}>
            <Paper className={classes.paper}>
              <h3>Dados da Empresa</h3>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="number"
                      id="cnpj"
                      name="cnpj"
                      label="CNPJ"
                      value={cnpj}
                      onChange={e => setCnpj(e.target.value)}
                      fullWidth
                      autoComplete="cnpj"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="number"
                      id="celular"
                      name="celular"
                      label="Celular"
                      value={celular}
                      onChange={e => setCelular(e.target.value)}
                      fullWidth
                      autoComplete="celular"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="email"
                      id="email"
                      name="email"
                      label="E-mail"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      fullWidth
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="number"
                      id="horarioNormal"
                      name="horarioNormal"
                      label="Horário Normal"
                      value={horarioNormal}
                      onChange={e => setHorarioNormal(e.target.value)}
                      fullWidth
                      autoComplete="horarioNormal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="number"
                      id="horarioFeriado"
                      name="horarioFeriado"
                      label="Horário Feriado"
                      value={horarioFeriado}
                      onChange={e => setHorarioFeriado(e.target.value)}
                      fullWidth
                      autoComplete="horarioFeriado"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      type="text"
                      id="semanaAberto"
                      name="semanaAberto"
                      label="Dias da Semana Aberto"
                      value={diasSemanaAberto}
                      onChange={e => setDiasSemanaAberto(e.target.value)}
                      fullWidth
                      autoComplete="semanaAberto"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <h4>Endereço da Empresa</h4>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="number"
                      id="cep"
                      name="cep"
                      label="CEP"
                      value={cep}
                      onChange={e => setCep(e.target.value)}
                      fullWidth
                      autoComplete="cep"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="text"
                      id="uf"
                      name="uf"
                      label="UF"
                      value={uf}
                      onChange={e => setUf(e.target.value)}
                      fullWidth
                      autoComplete="uf"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="text"
                      id="cidade"
                      name="cidade"
                      label="Cidade"
                      value={cidade}
                      onChange={e => setCidade(e.target.value)}
                      fullWidth
                      autoComplete="cidade"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="text"
                      id="logradouro"
                      name="logradouro"
                      label="Logradouro"
                      value={logradouro}
                      onChange={e => setLogradouro(e.target.value)}
                      fullWidth
                      autoComplete="logradouro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      type="text"
                      id="bairro"
                      name="bairro"
                      label="Bairro"
                      value={bairro}
                      onChange={e => setBairro(e.target.value)}
                      fullWidth
                      autoComplete="bairro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
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
  );
}
 
export default Profile;


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