import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { CheckoutChangeHandler, RegistrationDetails } from "../types";

interface UserFormProps {
  values: RegistrationDetails;
  onChange: CheckoutChangeHandler<RegistrationDetails>;
}

const UserForm = ({ values, onChange }: UserFormProps) => (
  <>
    <Typography variant="h6" gutterBottom>
      Dados de Registro
    </Typography>
    <Grid container spacing={3}>
      <Grid size={12}>
        <TextField
          required
          fullWidth
          id="nome"
          label="Nome"
          name="nome"
          value={values.nome}
          onChange={onChange("nome")}
          autoComplete="name"
          autoFocus
        />
      </Grid>
      <Grid size={12}>
        <TextField
          required
          fullWidth
          id="username"
          label="Usuário"
          name="username"
          value={values.username}
          onChange={onChange("username")}
          autoComplete="username"
        />
      </Grid>
      <Grid size={12}>
        <TextField
          required
          fullWidth
          type="email"
          id="email"
          label="E-mail"
          name="email"
          value={values.email}
          onChange={onChange("email")}
          autoComplete="email"
        />
      </Grid>
      <Grid size={12}>
        <TextField
          required
          fullWidth
          name="password"
          label="Senha"
          type="password"
          id="password"
          value={values.password}
          onChange={onChange("password")}
          autoComplete="new-password"
        />
      </Grid>
    </Grid>
  </>
);

export default UserForm;
