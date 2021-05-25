import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


const UserForm = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Dados de Registro
      </Typography>
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
          <TextField
            required
            type="email"
            id="email"
            name="email"
            label="E-mail"
            fullWidth
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            type="password"
            id="password"
            name="password"
            label="Senha"
            fullWidth
            autoComplete="password"
          />
        </Grid>
      </Grid>
    </>
  );
}

export default UserForm;