import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Cep from "cep-promise";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../../components/FooterGer";
import MenuClient from "../../../../components/MenuClient";
import { useCart } from "../../../../hooks/useCart";
import { createPedido } from "../../../../services/pedidos";
import type { ClientePedido } from "../../../../types/domain";
import { getErrorMessage } from "../../../../util/errors";
import CustomerFields from "./CustomerFields";
import OrderOptions, {
  type DeliveryMethodSelection,
  type PaymentMethodSelection,
} from "./OrderOptions";

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const NewPedido = () => {
  const navigate = useNavigate();
  const { subdominio } = useParams<{ subdominio: string }>();
  const { cart, clearCart } = useCart();
  const [customer, setCustomer] = useState<ClientePedido>({ nome: "", cpf: "", celular: "" });
  const [tipoPagamento, setTipoPagamento] = useState<PaymentMethodSelection>("default");
  const [tipoEntrega, setTipoEntrega] = useState<DeliveryMethodSelection>("default");
  const [trocoPagamento, setTrocoPagamento] = useState("");
  const [mesa, setMesa] = useState("");
  const [horas, setHoras] = useState("");
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const cepRequest = useRef(0);

  useEffect(() => () => {
    cepRequest.current += 1;
  }, []);

  const handleCustomerChange = (field: keyof ClientePedido) => (
    event: TextInputEvent,
  ): void => {
    setCustomer((current) => ({ ...current, [field]: event.target.value }));
  };

  function clearAddress(): void {
    setUf("");
    setCidade("");
    setLogradouro("");
    setBairro("");
  }

  function handleCep(event: TextInputEvent): void {
    const value = event.target.value;
    setCep(value);
    const requestId = ++cepRequest.current;

    if (value.replace(/\D/g, "").length !== 8) {
      clearAddress();
      return;
    }

    void Cep(value)
      .then((response) => {
        if (requestId !== cepRequest.current) return;
        setUf(response.state ?? "");
        setCidade(response.city ?? "");
        setLogradouro(response.street ?? "");
        setBairro(response.neighborhood ?? "");
      })
      .catch((error: unknown) => {
        if (requestId !== cepRequest.current) return;
        clearAddress();
        if (import.meta.env.DEV) console.error("Erro ao consultar CEP", error);
      });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      if (!subdominio) throw new Error("Estabelecimento inválido.");
      if (tipoPagamento === "default") throw new Error("Selecione uma forma de pagamento.");
      if (tipoEntrega === "default") throw new Error("Selecione uma forma de entrega.");

      const pedidoId = await createPedido({
        subdominio,
        cliente: customer,
        tipoPagamento,
        trocoPagamento,
        tipoEntrega,
        mesa,
        horas,
        endereco: { cep, uf, cidade, logradouro, bairro, numero },
        produtos: cart,
      });

      clearCart();
      navigate(`/${subdominio}/pedidos`, { state: { pedidoId } });
    } catch (error) {
      setFeedback(`Não foi possível criar o pedido: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro ao criar pedido", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Novo Pedido</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container sx={{ m: "auto" }} size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 2, display: "flex", overflow: "auto", flexDirection: "column" }}>
              <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>
                    Preencha o formulário do pedido
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <CustomerFields values={customer} onChange={handleCustomerChange} />
                      <OrderOptions
                        paymentMethod={tipoPagamento}
                        onPaymentMethodChange={(event) => setTipoPagamento(event.target.value as PaymentMethodSelection)}
                        trocoPagamento={trocoPagamento}
                        onTrocoChange={(event) => setTrocoPagamento(event.target.value)}
                        deliveryMethod={tipoEntrega}
                        onDeliveryMethodChange={(event) => setTipoEntrega(event.target.value as DeliveryMethodSelection)}
                        mesa={mesa}
                        onMesaChange={(event) => setMesa(event.target.value)}
                        horas={horas}
                        onHorasChange={(event) => setHoras(event.target.value)}
                        cep={cep}
                        uf={uf}
                        cidade={cidade}
                        logradouro={logradouro}
                        bairro={bairro}
                        numero={numero}
                        onCepChange={handleCep}
                        onUfChange={(event) => setUf(event.target.value)}
                        onCidadeChange={(event) => setCidade(event.target.value)}
                        onLogradouroChange={(event) => setLogradouro(event.target.value)}
                        onBairroChange={(event) => setBairro(event.target.value)}
                        onNumeroChange={(event) => setNumero(event.target.value)}
                      />
                      <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <input
                          style={{ backgroundColor: "#14bb14", color: "white", fontSize: 16, padding: "10px 26px", border: "none", borderRadius: 5 }}
                          type="submit"
                          value={saving ? "SALVANDO..." : "SALVAR"}
                          disabled={saving || cart.length === 0}
                        />
                      </Grid>
                    </Grid>
                  </form>
                  {feedback && <Typography color="error" sx={{ mt: 2 }}>{feedback}</Typography>}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>

        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default NewPedido;
