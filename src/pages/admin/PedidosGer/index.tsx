import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import { usePedidos } from "../../../hooks/usePedidos";
import PedidosTable from "./PedidosTable";

const PedidosGer = () => {
  const { pedidos, error, updateStatus } = usePedidos();

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Pedidos dos Clientes</Menu>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ sm: 12 }}>
              <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column" }}>
                <Grid container spacing={3}>
                  {error && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <PedidosTable
                      pedidos={pedidos}
                      onStatusChange={updateStatus}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ pt: 4 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default PedidosGer;
