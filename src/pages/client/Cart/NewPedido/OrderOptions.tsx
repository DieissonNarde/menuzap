import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import type { ChangeEvent } from "react";

import type { TipoEntrega, TipoPagamento } from "../../../../types/domain";

export type PaymentMethodSelection = TipoPagamento | "default";
export type DeliveryMethodSelection = TipoEntrega | "default";
type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type TextChangeHandler = (event: TextInputEvent) => void;

interface OrderOptionsProps {
  paymentMethod: PaymentMethodSelection;
  onPaymentMethodChange: (event: SelectChangeEvent<PaymentMethodSelection>) => void;
  trocoPagamento: string;
  onTrocoChange: TextChangeHandler;
  deliveryMethod: DeliveryMethodSelection;
  onDeliveryMethodChange: (event: SelectChangeEvent<DeliveryMethodSelection>) => void;
  mesa: string;
  onMesaChange: TextChangeHandler;
  horas: string;
  onHorasChange: TextChangeHandler;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  numero: string;
  onCepChange: TextChangeHandler;
  onUfChange: TextChangeHandler;
  onCidadeChange: TextChangeHandler;
  onLogradouroChange: TextChangeHandler;
  onBairroChange: TextChangeHandler;
  onNumeroChange: TextChangeHandler;
}

const OrderOptions = ({
  paymentMethod,
  onPaymentMethodChange,
  trocoPagamento,
  onTrocoChange,
  deliveryMethod,
  onDeliveryMethodChange,
  mesa,
  onMesaChange,
  horas,
  onHorasChange,
  cep,
  uf,
  cidade,
  logradouro,
  bairro,
  numero,
  onCepChange,
  onUfChange,
  onCidadeChange,
  onLogradouroChange,
  onBairroChange,
  onNumeroChange,
}: OrderOptionsProps) => (
  <>
    <Grid size={12}>
      <Select<PaymentMethodSelection> id="tipo-pagamento" value={paymentMethod} onChange={onPaymentMethodChange} fullWidth>
        <MenuItem value="default"><em>Selecione o método de pagamento</em></MenuItem>
        <MenuItem value="dinheiro">Dinheiro</MenuItem>
        <MenuItem value="debito">Débito</MenuItem>
        <MenuItem value="credito">Crédito</MenuItem>
        <MenuItem value="pix">Pix</MenuItem>
      </Select>
    </Grid>

    {paymentMethod === "dinheiro" && (
      <Grid size={12}>
        <TextField required id="troco-pagamento" name="troco-pagamento" label="Troco do pagamento" value={trocoPagamento} onChange={onTrocoChange} fullWidth />
      </Grid>
    )}

    <Grid size={12}>
      <Select<DeliveryMethodSelection> id="tipo-entrega" value={deliveryMethod} onChange={onDeliveryMethodChange} fullWidth>
        <MenuItem value="default"><em>Selecione uma forma de entrega</em></MenuItem>
        <MenuItem value="mesa">Mesa</MenuItem>
        <MenuItem value="buscar">Buscar no local</MenuItem>
        <MenuItem value="delivery">Delivery</MenuItem>
      </Select>
    </Grid>

    {deliveryMethod === "mesa" && (
      <Grid size={12}>
        <TextField required id="mesa" name="mesa" label="Mesa" value={mesa} onChange={onMesaChange} fullWidth autoComplete="off" />
      </Grid>
    )}
    {deliveryMethod === "buscar" && (
      <Grid size={12}>
        <TextField required type="time" id="horas" name="horas" label="Horário" value={horas} onChange={onHorasChange} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
      </Grid>
    )}
    {deliveryMethod === "delivery" && (
      <>
        <Grid size={12}>
          <TextField required id="cep" name="cep" label="CEP" value={cep} onChange={onCepChange} fullWidth autoComplete="postal-code" />
        </Grid>
        <Grid size={12}>
          <TextField required id="uf" name="uf" label="UF" value={uf} onChange={onUfChange} fullWidth autoComplete="address-level1" />
        </Grid>
        <Grid size={12}>
          <TextField required id="cidade" name="cidade" label="Cidade" value={cidade} onChange={onCidadeChange} fullWidth autoComplete="address-level2" />
        </Grid>
        <Grid size={12}>
          <TextField required id="logradouro" name="logradouro" label="Logradouro" value={logradouro} onChange={onLogradouroChange} fullWidth autoComplete="street-address" />
        </Grid>
        <Grid size={12}>
          <TextField required id="bairro" name="bairro" label="Bairro" value={bairro} onChange={onBairroChange} fullWidth autoComplete="address-level3" />
        </Grid>
        <Grid size={12}>
          <TextField required id="numero" name="numero" label="Número" value={numero} onChange={onNumeroChange} fullWidth autoComplete="off" />
        </Grid>
      </>
    )}
  </>
);

export default OrderOptions;
