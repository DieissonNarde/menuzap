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
import { login } from "../../services/parse/auth.service";
import { getErrorMessage } from "../../util/errors";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      setFeedback(`Não foi possível entrar: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro no login", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={(theme) => ({ m: 1, bgcolor: theme.palette.secondary.main })}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 1 }} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          {feedback && <Typography color="error">{feedback}</Typography>}
          <Grid container sx={{ justifyContent: "flex-end" }}>
            <Grid>
              <Link component={RouterLink} to="/checkout" variant="body2">
                Não possui uma conta? Clique aqui
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ mt: 8 }}><Footer /></Box>
    </Container>
  );
};

export default Login;
