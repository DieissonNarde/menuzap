import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { lazy } from "react";

import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import { usePedidos } from "../../../hooks/usePedidos";

const Chart = lazy(() => import("../../../components/Chart"));
const Pendents = lazy(() => import("../../../components/Pendents"));
const Pedidos = lazy(() => import("../../../components/Pedidos"));

const Dashboard = () => {
  const { pedidos, error } = usePedidos();

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Dashboard</Menu>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
              <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column", height: 240 }}>
                <Chart pedidos={pedidos} />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column", height: 240 }}>
                <Pendents pedidos={pedidos} />
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column" }}>
                <Pedidos pedidos={pedidos} />
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

export default Dashboard;
