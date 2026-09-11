import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Footer from "../../components/FooterGer";
import { registerOwner } from "../../services/parse/auth.service";
import { getErrorMessage } from "../../util/errors";

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      await registerOwner({ nome, username, email, password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFeedback(`Não foi possível criar o cadastro: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro no cadastro", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={(theme) => ({ m: 1, bgcolor: theme.palette.secondary.main })}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Cadastro</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 3 }} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth id="nome" label="Nome" name="nome" value={nome} onChange={(event) => setNome(event.target.value)} autoComplete="name" autoFocus />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth id="username" label="Usuário" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth type="email" id="email" label="Email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth name="password" label="Senha" type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" disabled={saving} sx={{ mt: 3, mb: 2 }}>
            {saving ? "Cadastrando..." : "Cadastrar"}
          </Button>
          {feedback && <Typography color="error">{feedback}</Typography>}
          <Grid container sx={{ justifyContent: "flex-end" }}>
            <Grid>
              <Link component={RouterLink} to="/login" variant="body2">
                Já possui uma conta? Entrar
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 5 }}><Footer /></Box>
    </Container>
  );
}
