import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";

import Button from "../../../components/Button";
import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import { usePedidos } from "../../../hooks/usePedidos";
import type { StatusPedido } from "../../../types/domain";
import { formatPrice } from "../../../util/format";

type ReportStatus = Extract<StatusPedido, "finalizado" | "cancelado">;
type ReportSelection = ReportStatus | "default";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const Relatorios = () => {
  const { pedidos, error } = usePedidos();
  const [relatorio, setRelatorio] = useState<ReportSelection>("default");

  const filteredPedidos = useMemo(() => (
    relatorio === "default"
      ? []
      : pedidos.filter(({ status }) => status === relatorio)
  ), [pedidos, relatorio]);

  const handleChange = (event: SelectChangeEvent<ReportSelection>): void => {
    setRelatorio(event.target.value as ReportSelection);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Relatórios</Menu>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={4} sx={{ justifyContent: "flex-end" }}>
            <Grid>
              <Button onClick={() => window.print()} disabled={relatorio === "default"}>
                Imprimir relatório
              </Button>
            </Grid>
          </Grid>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={3} sx={{ mb: 2.5 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Select<ReportSelection> id="select-relatorio" value={relatorio} onChange={handleChange} fullWidth>
                  <MenuItem value="default"><em>Selecione um relatório</em></MenuItem>
                  <MenuItem value="finalizado">Pedidos finalizados</MenuItem>
                  <MenuItem value="cancelado">Pedidos cancelados</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <TableContainer>
              <Table size="small" aria-label="Relatório de pedidos">
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Pagamento</TableCell>
                    <TableCell align="right">Valor total</TableCell>
                    <TableCell align="right">Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPedidos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          {relatorio === "default"
                            ? "Selecione o tipo de relatório."
                            : "Nenhum pedido encontrado para este relatório."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell component="th" scope="row">{pedido.nome}</TableCell>
                        <TableCell>{pedido.cpf}</TableCell>
                        <TableCell>{pedido.tipoPagamento || "Não informado"}</TableCell>
                        <TableCell align="right">{formatPrice(pedido.valorTotal)}</TableCell>
                        <TableCell align="right">{dateFormatter.format(pedido.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default Relatorios;
