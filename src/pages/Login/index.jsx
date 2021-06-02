import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Parse from "parse";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Footer from '../../components/FooterGer'


const Login = () => {
  const classes = useStyles();
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(ev) {
    ev.preventDefault();

    await Parse.User.logIn(username, password)
      .then(() => {
        history.push('/dashboard');
      })
      .catch((error) => {
        // Show the error message somewhere and let the user try again.
        alert("Infelizmente houve algum erro ao tentar logar. Tente novamente! Erro: " + error.code);
        console.log("Error Login: " + error.code + " " + error.message)
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/checkout" variant="body2">
                {"Não possui uma conta? clique aqui"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  );
}

export default Login;


const useStyles = makeStyles((theme) => ({
  paper: {marginTop: theme.spacing(8), display: 'flex', flexDirection: 'column', alignItems: 'center', },
  avatar: {margin: theme.spacing(1), backgroundColor: theme.palette.secondary.main, },
  form: {width: '100%', marginTop: theme.spacing(1), },
  submit: {margin: theme.spacing(3, 0, 2), },
}));