import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import {
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { PedidoResumo } from "../../types/domain";
import Title from "../Title";

interface ChartProps {
  pedidos: PedidoResumo[];
}

interface HourData {
  time: string;
  quantidade: number;
}

function isSameLocalDay(date: Date, reference: Date): boolean {
  return date.getFullYear() === reference.getFullYear()
    && date.getMonth() === reference.getMonth()
    && date.getDate() === reference.getDate();
}

export default function Chart({ pedidos }: ChartProps) {
  const theme = useTheme();
  const { data, totalToday } = useMemo(() => {
    const today = new Date();
    const hourlyData: HourData[] = Array.from({ length: 24 }, (_, hour) => ({
      time: `${String(hour).padStart(2, "0")}:00`,
      quantidade: 0,
    }));
    let todayCount = 0;

    pedidos.forEach((pedido) => {
      const createdAt = new Date(pedido.createdAt);
      if (Number.isNaN(createdAt.getTime()) || !isSameLocalDay(createdAt, today)) return;

      hourlyData[createdAt.getHours()].quantidade += 1;
      todayCount += 1;
    });

    return { data: hourlyData, totalToday: todayCount };
  }, [pedidos]);

  return (
    <>
      <Title>Pedidos de hoje</Title>
      {totalToday === 0 ? (
        <Typography color="text.secondary" sx={{ my: "auto", textAlign: "center" }}>
          Nenhum pedido registrado hoje.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 16, bottom: 0, left: 24 }}
          >
            <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
            <YAxis
              allowDecimals={false}
              domain={[0, "auto"]}
              stroke={theme.palette.text.secondary}
            >
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
              >
                Quantidade
              </Label>
            </YAxis>
            <Line
              type="monotone"
              dataKey="quantidade"
              stroke={theme.palette.primary.main}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
