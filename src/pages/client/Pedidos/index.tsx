import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Link, useLocation, useParams } from "react-router-dom";

import Footer from "../../../components/FooterGer";
import MenuClient from "../../../components/MenuClient";

interface PedidoNavigationState {
  pedidoId?: unknown;
}

const Pedidos = () => {
  const { subdominio } = useParams<{ subdominio: string }>();
  const location = useLocation();
  const state = location.state as PedidoNavigationState | null;
  const pedidoId = typeof state?.pedidoId === "string" ? state.pedidoId : "";
  const menuPath = subdominio ? `/${subdominio}/menu` : "/";

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Pedido enviado</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, minHeight: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="sm" sx={{ pt: 6, pb: 6 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            {pedidoId ? (
              <>
                <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
                  Seu pedido foi recebido pelo estabelecimento.
                </Alert>
                <Typography variant="h5" component="h1" gutterBottom>
                  Pedido #{pedidoId}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Guarde este código caso precise falar com o estabelecimento.
                </Typography>
              </>
            ) : (
              <Alert severity="info" sx={{ mb: 3, textAlign: "left" }}>
                Nenhum pedido acabou de ser enviado nesta navegação.
              </Alert>
            )}

            <Button component={Link} to={menuPath} variant="contained">
              Voltar ao cardápio
            </Button>
          </Paper>
        </Container>

        <Box sx={{ pt: 4 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Pedidos;
