import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import {
  STATUS_PEDIDO,
  type PedidoResumo,
  type StatusPedido,
} from "../../../types/domain";

interface PedidosTableProps {
  pedidos: readonly PedidoResumo[];
  onStatusChange: (id: string, status: StatusPedido) => void | Promise<void>;
}

const STATUS_LABELS: Record<StatusPedido, string> = {
  novo: "Novo",
  "em andamento": "Em andamento",
  pronto: "Pronto",
  "em transporte": "Em transporte",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

const PedidosTable = ({ pedidos, onStatusChange }: PedidosTableProps) => {
  const handleStatusChange = (
    id: string,
    event: SelectChangeEvent<StatusPedido>,
  ): void => {
    void onStatusChange(id, event.target.value as StatusPedido);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell align="right">CPF</TableCell>
            <TableCell align="right">Tipo Pagamento</TableCell>
            <TableCell align="right">Tipo Entrega</TableCell>
            <TableCell align="right">Valor Total</TableCell>
            <TableCell align="right">STATUS</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos
            .filter((pedido) => pedido.status !== "finalizado")
            .map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell component="th" scope="row">
                  {pedido.nome}
                </TableCell>
                <TableCell align="center">{pedido.cpf}</TableCell>
                <TableCell align="center">{pedido.tipoPagamento}</TableCell>
                <TableCell align="center">{pedido.tipoEntrega}</TableCell>
                <TableCell align="center">{pedido.valorTotal}</TableCell>
                <TableCell align="center">
                  <Select<StatusPedido>
                    id={`pedido-status-${pedido.id}`}
                    value={pedido.status}
                    onChange={(event) => handleStatusChange(pedido.id, event)}
                    fullWidth
                  >
                    {STATUS_PEDIDO.map((status) => (
                      <MenuItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="right">
                  {pedido.createdAt.toLocaleString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PedidosTable;
