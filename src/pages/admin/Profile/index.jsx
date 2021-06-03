import React, { useState } from 'react';
import Parse from "parse";
import Cep from 'cep-promise';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Typography from '@material-ui/core/Typography';

import Menu from '../../../components/Menu';
import Footer from '../../../components/FooterGer';
import { InputCep, InputPhone, InputHour } from "../../../components/InputMasks";


const Profile = () => {
  const classes = useStyles();

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [celular, setCelular] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [inicioSemanaAberto, setInicioSemanaAberto] = useState('segunda');
  const [fimSemanaAberto, setFimSemanaAberto] = useState('sexta');
  const [inicioHorarioNormal, setInicioHorarioNormal] = useState('');
  const [fimHorarioNormal, setFimHorarioNormal] = useState('');
  const [inicioHorarioFeriado, setInicioHorarioFeriado] = useState('');
  const [fimHorarioFeriado, setFimHorarioFeriado] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [file, setFile] = useState('');

  function handleChange(e) {
    if(e.target.files.length > 0) {
      let eventFile = e.target.files[0];
      setFile(eventFile);
    }
  }

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
  
  async function handleSubmit(ev) {
    ev.preventDefault();

    const name = "logo.png";
    const parseFile = new Parse.File(name, file);

    await parseFile.save().then(() => {
      // The file has been saved to Parse.
      const Empresa = Parse.Object.extend('Empresa');
      const newEmpresa = new Empresa();

      newEmpresa.set('id_user', Parse.User.current());
      newEmpresa.set('logo', parseFile);
      newEmpresa.set('nome', nome);
      newEmpresa.set('cnpj', cnpj);
      newEmpresa.set('celular', celular);
      newEmpresa.set('telefone', telefone);
      newEmpresa.set('email', email);
      newEmpresa.set('cep', cep);
      newEmpresa.set('inicioSemanaAberto', inicioSemanaAberto);
      newEmpresa.set('fimSemanaAberto', fimSemanaAberto);
      newEmpresa.set('inicioHorarioNormal', inicioHorarioNormal);
      newEmpresa.set('fimHorarioNormal', fimHorarioNormal);
      newEmpresa.set('inicioHorarioFeriado', inicioHorarioFeriado);
      newEmpresa.set('fimHorarioFeriado', fimHorarioFeriado);
      newEmpresa.set('uf', uf);
      newEmpresa.set('cidade', cidade);
      newEmpresa.set('logradouro', logradouro);
      newEmpresa.set('bairro', bairro);
      newEmpresa.set('numero', numero);

      newEmpresa.save().then(
        (result) => {
          alert('Empresa created', result);
        },
        (error) => {
          alert('Infelizmente não foi possível salvar na base de dados, tente novamente. Erro: ', error);
          console.error('Error while creating Empresa: ', error);
        }
      );
    },
    (err) => {
      // The file either could not be read, or could not be saved to Parse.
      alert('Infelizmente não foi possível salvar a imagem na base de dados, tente novamente. Erro: ', err);
      console.error('Not be sabed to Parse: ', err);
    });
  }

  return ( 
    <div className={classes.root}>
      <Menu>Minha Conta</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={8} className={classes.grid}>
            <Paper className={classes.paper}>
              <h3>Dados da Empresa</h3>
              <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid container className={classes.gridFile} justify="center">
                    <Grid item xs={12} sm={12}>
                      <Typography
                        className={classes.title}
                        gutterBottom
                        variant="h6"
                        component="h5"
                      >
                        Logo da Empresa
                      </Typography>
                    </Grid>
                    <label htmlFor="icon-button-file">
                      <IconButton color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    <input accept="image/*" onChange={handleChange} className={classes.input} id="icon-button-file" type="file" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <InputCep
                      value={cnpj}
                      onChange={e => setCnpj(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputPhone
                      value={celular}
                      onChange={e => setCelular(e.target.value)}
                    />

                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputPhone
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
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

                  <Grid item xs={12} sm={12}>
                    <h4>Horário de Funcionamento</h4>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <h6>Semana</h6>
                  </Grid>
                  <Grid className={classes.gridSelect} container spacing={3} justify="space-between">
                    <Grid item xs={12} sm={5}>
                      <Select
                        id="inicioSemanaAberto"
                        value={inicioSemanaAberto}
                        onChange={e => setInicioSemanaAberto(e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="domingo">Domingo</MenuItem>
                        <MenuItem value="segunda">Segunda</MenuItem>
                        <MenuItem value="terca">Terça</MenuItem>
                        <MenuItem value="quarta">Quarta</MenuItem>
                        <MenuItem value="quinta">Quinta</MenuItem>
                        <MenuItem value="sexta">Sexta</MenuItem>
                        <MenuItem value="sabado">Sábado</MenuItem>
                      </Select>
                    </Grid>
                    <span className={classes.span}>À</span>
                    <Grid item xs={12} sm={5}>
                      <Select
                        id="fimSemanaAberto"
                        value={fimSemanaAberto}
                        onChange={e => setFimSemanaAberto(e.target.value)}
                        fullWidth
                      >
                        <MenuItem value="domingo">Domingo</MenuItem>
                        <MenuItem value="segunda">Segunda</MenuItem>
                        <MenuItem value="terca">Terça</MenuItem>
                        <MenuItem value="quarta">Quarta</MenuItem>
                        <MenuItem value="quinta">Quinta</MenuItem>
                        <MenuItem value="sexta">Sexta</MenuItem>
                        <MenuItem value="sabado">Sábado</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
          
                  <Grid item xs={12} sm={6}>
                    <Grid className={classes.gridSelect} container xs={12} sm={12} justify="space-between">
                      <Grid item xs={12} sm={12}>
                        <h6>Horário Normal</h6>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <InputHour
                          value={inicioHorarioNormal}
                          onChange={e => setInicioHorarioNormal(e.target.value)}
                        />
                      </Grid>
                        <span className={classes.spanHorario}>ÀS</span>
                      <Grid item xs={12} sm={5}>
                        <InputHour
                          value={fimHorarioNormal}
                          onChange={e => setFimHorarioNormal(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid className={classes.gridSelect} container xs={12} sm={12} justify="space-between">
                      <Grid item xs={12} sm={12}>
                        <h6>Horário Feriado</h6>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <InputHour
                          value={inicioHorarioFeriado}
                          onChange={e => setInicioHorarioFeriado(e.target.value)}
                        />
                      </Grid>
                        <span className={classes.spanHorario}>ÀS</span>
                      <Grid item xs={12} sm={5}>
                        <InputHour
                          value={fimHorarioFeriado}
                          onChange={e => setFimHorarioFeriado(e.target.value)}
                        />
                      </Grid>
                    </Grid>
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
                      onChange={handleCep}
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
  title: {flexGrow: 1, marginLeft: 12, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  grid: {margin: 'auto', },
  paper: {padding: 25, display: 'flex', overflow: 'auto', flexDirection: 'column', alignSelf: 'center', },
  gridFile: {marginTop: 20, },
  input: {marginTop: 10, color: '#A9A9A9', },
  gridSelect: {marginLeft: 1, marginRight: 1, },
  span: {fontSize: 14, fontWeight: 'bold', textAlign: 'center', padding: 0, lineHeight: 5, },
  spanHorario: {fontSize: 12, fontWeight: 'bold', textAlign: 'center', padding: 0, lineHeight: 6, },
  gridSubmit: {display: 'flex', justifyContent: 'flex-end', },
  submit: {backgroundColor: '#14bb14', color: 'white', fontSize: 16, padding: '10px 26px', border: 'none', borderRadius: 5, },
}));