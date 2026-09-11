import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import type { ChangeEvent } from "react";

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface AddressFieldsProps {
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  bairro: string;
  numero: string;
  onCepChange: (event: TextInputEvent) => void;
  onUfChange: (event: TextInputEvent) => void;
  onCidadeChange: (event: TextInputEvent) => void;
  onLogradouroChange: (event: TextInputEvent) => void;
  onBairroChange: (event: TextInputEvent) => void;
  onNumeroChange: (event: TextInputEvent) => void;
}

const AddressFields = ({
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
}: AddressFieldsProps) => (
  <>
    <Grid size={12}>
      <h5>Endereço da Empresa</h5>
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField
        id="cep"
        name="cep"
        label="CEP"
        value={cep}
        onChange={onCepChange}
        fullWidth
        inputMode="numeric"
        autoComplete="postal-code"
      />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField id="uf" name="uf" label="UF" value={uf} onChange={onUfChange} fullWidth autoComplete="address-level1" />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField id="cidade" name="cidade" label="Cidade" value={cidade} onChange={onCidadeChange} fullWidth autoComplete="address-level2" />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField id="logradouro" name="logradouro" label="Logradouro" value={logradouro} onChange={onLogradouroChange} fullWidth autoComplete="street-address" />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField id="bairro" name="bairro" label="Bairro" value={bairro} onChange={onBairroChange} fullWidth autoComplete="address-level3" />
    </Grid>
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField id="numero" name="numero" label="Número" value={numero} onChange={onNumeroChange} fullWidth inputMode="numeric" autoComplete="off" />
    </Grid>
  </>
);

export default AddressFields;
