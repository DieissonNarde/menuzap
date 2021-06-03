import React, { useState, useEffect } from 'react';
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
import { InputCnpj, InputPhone, InputHour } from "../../../components/InputMasks";


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

  useEffect(() => {
    async function getEmpresa() {
      const Empresa = Parse.Object.extend('Empresa');
      const query = new Parse.Query(Empresa);
      // here you put the objectId that you want to update
      query.equalTo("id_user", Parse.User.current());
      const empresa = await query.first();

      setNome(empresa.get('nome'));
      setCnpj(empresa.get('cnpj'));
      setCelular(empresa.get('celular'));
      setTelefone(empresa.get('telefone'));
      setEmail(empresa.get('email'));
      setInicioSemanaAberto(empresa.get('inicioSemanaAberto'));
      setFimSemanaAberto(empresa.get('fimSemanaAberto'));
      setInicioHorarioNormal(empresa.get('inicioHorarioNormal'));
      setFimHorarioNormal(empresa.get('fimHorarioNormal'));
      setInicioHorarioFeriado(empresa.get('inicioHorarioFeriado'));
      setFimHorarioFeriado(empresa.get('fimHorarioFeriado'));
      setCep(empresa.get('cep'));
      setUf(empresa.get('uf'));
      setCidade(empresa.get('cidade'));
      setLogradouro(empresa.get('logradouro'));
      setBairro(empresa.get('bairro'));
      setNumero(empresa.get('numero'));
    }

    getEmpresa();
  }, [])

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

    const Empresa = Parse.Object.extend('Empresa');
    const query = new Parse.Query(Empresa);
    // here you put the objectId that you want to update
    query.equalTo("id_user", Parse.User.current());
    const empresa = await query.first();

    if(file !== '') {
      const name = "logo.png";
      const parseFile = new Parse.File(name, file);
      await parseFile.save().then(() => {
          empresa.set('logo', parseFile);
        },
        (err) => {
          // The file either could not be read, or could not be saved to Parse.
          alert('Infelizmente não foi possível salvar a imagem na base de dados, tente novamente. Erro: ', err);
          console.error('Not be sabed to Parse: ', err);
        }
      );
    }

    empresa.set('nome', nome);
    empresa.set('cnpj', cnpj);
    empresa.set('celular', celular);
    empresa.set('telefone', telefone);
    empresa.set('email', email);
    empresa.set('cep', cep);
    empresa.set('inicioSemanaAberto', inicioSemanaAberto);
    empresa.set('fimSemanaAberto', fimSemanaAberto);
    empresa.set('inicioHorarioNormal', inicioHorarioNormal);
    empresa.set('fimHorarioNormal', fimHorarioNormal);
    empresa.set('inicioHorarioFeriado', inicioHorarioFeriado);
    empresa.set('fimHorarioFeriado', fimHorarioFeriado);
    empresa.set('uf', uf);
    empresa.set('cidade', cidade);
    empresa.set('logradouro', logradouro);
    empresa.set('bairro', bairro);
    empresa.set('numero', numero);

    await empresa.save().then(
      (result) => {
        alert('Empresa Update', result);
      },
      (error) => {
        alert('Infelizmente não foi possível atualizar os dados da Empresa. Tente novamente! Erro: ', error);
        console.error('Error while creating Empresa: ', error);
      }
    );
  }

  return ( 
    <div className={classes.root}>
      <Menu>Minha Conta</Menu>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={12} sm={9} className={classes.grid}>
            <Paper className={classes.paper}>
              <h3>Dados da Empresa</h3>
              <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid container className={classes.gridFile} justify="center">
                    <Grid item xs={12} sm={12}>
                      <Typography
                        className={classes.titleLogo}
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
                    <InputCnpj
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
                    <h5>Horário de Funcionamento</h5>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      className={classes.title}
                      gutterBottom
                      variant="h6"
                      component="h6"
                    >
                      Semana
                    </Typography>
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
                        <Typography
                          className={classes.title}
                          gutterBottom
                          variant="h6"
                          component="h6"
                        >
                          Horário Normal
                        </Typography>
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
                        <Typography
                          className={classes.title}
                          gutterBottom
                          variant="h6"
                          component="h6"
                        >
                          Horário Feriado
                        </Typography>
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
                    <h5>Endereço da Empresa</h5>
                  </Grid>
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
                  <Grid item xs={12} sm={4}>
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
  titleLogo: {flexGrow: 1, marginLeft: 12, color: '#A9A9A9', },
  title: {flexGrow: 1, color: '#A9A9A9', },
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