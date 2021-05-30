import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


const UserForm = () => {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const data = {};

  function handleSubmit(ev) {
    ev.preventDefault();

    data = {
      'nome': nome,
      'username': username,
      'email': email,
      'password': password,
    }
  }

  // var dataUser = () => {
  //   const dataUser = data;
  //   return dataUser;
  // }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Dados de Registro
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              autoComplete="username"
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="email"
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default UserForm;