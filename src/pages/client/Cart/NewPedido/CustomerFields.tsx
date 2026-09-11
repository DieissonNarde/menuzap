import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import type { ChangeEvent } from "react";

import { InputCpf, InputPhone } from "../../../../components/InputMasks";
import type { ClientePedido } from "../../../../types/domain";

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface CustomerFieldsProps {
  values: ClientePedido;
  onChange: (field: keyof ClientePedido) => (event: TextInputEvent) => void;
}

const CustomerFields = ({ values, onChange }: CustomerFieldsProps) => (
  <>
    <Grid size={12}>
      <TextField required id="name" name="name" label="Nome" value={values.nome} onChange={onChange("nome")} fullWidth autoComplete="name" />
    </Grid>
    <Grid size={12}>
      <InputCpf required value={values.cpf} onChange={onChange("cpf")} />
    </Grid>
    <Grid size={12}>
      <InputPhone required value={values.celular} onChange={onChange("celular")} />
    </Grid>
  </>
);

export default CustomerFields;
