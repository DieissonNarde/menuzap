import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link as RouterLink } from "react-router-dom";

import type {
  PedidoResumo,
  StatusPedido,
  TipoEntrega,
  TipoPagamento,
} from "../../types/domain";
import { formatPrice } from "../../util/format";
import Title from "../Title";

interface PedidosProps {
  pedidos: PedidoResumo[];
}

const STATUS_LABELS: Record<StatusPedido, string> = {
  novo: "Novo",
  "em andamento": "Em andamento",
  pronto: "Pronto",
  "em transporte": "Em transporte",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

const PAYMENT_LABELS: Record<TipoPagamento, string> = {
  dinheiro: "Dinheiro",
  debito: "Débito",
  credito: "Crédito",
  pix: "Pix",
};

const DELIVERY_LABELS: Record<TipoEntrega, string> = {
  mesa: "Mesa",
  buscar: "Buscar no local",
  delivery: "Delivery",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function formatDate(value: Date): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

const Pedidos = ({ pedidos }: PedidosProps) => {
  const recentPedidos = [...pedidos]
    .sort((first, second) => (
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    ))
    .slice(0, 5);

  return (
    <>
      <Title>Pedidos recentes</Title>
      <Table size="small" aria-label="Pedidos recentes">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Entrega</TableCell>
            <TableCell>Pagamento</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentPedidos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Nenhum pedido encontrado.
              </TableCell>
            </TableRow>
          ) : (
            recentPedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{formatDate(pedido.createdAt)}</TableCell>
                <TableCell>{pedido.nome}</TableCell>
                <TableCell>
                  {pedido.tipoEntrega ? DELIVERY_LABELS[pedido.tipoEntrega] : "—"}
                </TableCell>
                <TableCell>
                  {pedido.tipoPagamento ? PAYMENT_LABELS[pedido.tipoPagamento] : "—"}
                </TableCell>
                <TableCell>{formatPrice(pedido.valorTotal)}</TableCell>
                <TableCell align="right">{STATUS_LABELS[pedido.status]}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div style={{ marginTop: 24 }}>
        <Link component={RouterLink} to="/pedidos/admin" color="primary">
          Ver todos os pedidos
        </Link>
      </div>
    </>
  );
};

export default Pedidos;
