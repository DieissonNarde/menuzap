import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchPedidosForCurrentUser,
  isStatusPedido,
  updatePedidoStatus,
} from "../services/pedidos";
import type { PedidoResumo, StatusPedido } from "../types/domain";
import { getErrorMessage } from "../util/errors";

interface UsePedidosResult {
  pedidos: PedidoResumo[];
  error: string;
  updateStatus: (id: string, status: StatusPedido) => Promise<void>;
}

export function usePedidos(): UsePedidosResult {
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([]);
  const [error, setError] = useState("");
  const mounted = useRef(true);

  useEffect(() => {
    let active = true;
    mounted.current = true;

    async function loadPedidos(): Promise<void> {
      try {
        const loadedPedidos = await fetchPedidosForCurrentUser();

        if (active) {
          setPedidos(loadedPedidos);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setPedidos([]);
          setError(
            `Não foi possível carregar os pedidos: ${getErrorMessage(loadError)}`,
          );
        }

        if (import.meta.env.DEV) {
          console.error("Erro ao carregar pedidos", loadError);
        }
      }
    }

    void loadPedidos();

    return () => {
      active = false;
      mounted.current = false;
    };
  }, []);

  const updateStatus = useCallback(async (
    id: string,
    status: StatusPedido,
  ): Promise<void> => {
    if (mounted.current) setError("");

    if (!isStatusPedido(status)) {
      if (mounted.current) setError("O status selecionado é inválido.");
      return;
    }

    try {
      await updatePedidoStatus(id, status);

      if (mounted.current) {
        setPedidos((currentPedidos) => currentPedidos.map((pedido) => (
          pedido.id === id ? { ...pedido, status } : pedido
        )));
      }
    } catch (updateError) {
      if (mounted.current) {
        setError(
          `Não foi possível atualizar o status do pedido: ${getErrorMessage(updateError)}`,
        );
      }

      if (import.meta.env.DEV) {
        console.error("Erro ao atualizar pedido", updateError);
      }
    }
  }, []);

  return { pedidos, error, updateStatus };
}
