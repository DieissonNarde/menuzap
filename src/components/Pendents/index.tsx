import Typography from "@mui/material/Typography";

import type { PedidoResumo } from "../../types/domain";
import Title from "../Title";

interface PendentsProps {
  pedidos: PedidoResumo[];
}

const Pendents = ({ pedidos }: PendentsProps) => {
  const pendingCount = pedidos.filter(
    ({ status }) => status !== "finalizado" && status !== "cancelado",
  ).length;

  return (
    <>
      <Title>Pedidos pendentes</Title>
      <Typography component="p" variant="h4">
        {pendingCount}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {pedidos.length === 0
          ? "Nenhum pedido encontrado."
          : `${pendingCount} de ${pedidos.length} pedidos carregados.`}
      </Typography>
    </>
  );
};

export default Pendents;
