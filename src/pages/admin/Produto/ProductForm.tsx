import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import type { FormEventHandler } from "react";

import ImagePicker from "../../../components/ImagePicker";

export interface ProductFormValues {
  nome: string;
  descricao: string;
  preco: string;
}

interface ProductFormProps {
  values: ProductFormValues;
  file: File | null;
  saving: boolean;
  disabled?: boolean;
  onChange: (field: keyof ProductFormValues, value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const ProductForm = ({
  values,
  file,
  saving,
  disabled = false,
  onChange,
  onFileChange,
  onSubmit,
}: ProductFormProps) => (
  <Box component="form" onSubmit={onSubmit}>
    <Grid container spacing={3}>
      <Grid size={12}>
        <ImagePicker file={file} onChange={onFileChange} label={file ? "Imagem selecionada" : "Selecionar imagem"} />
      </Grid>
      <Grid size={12}>
        <TextField required id="name" name="name" label="Nome" value={values.nome} onChange={(event) => onChange("nome", event.target.value)} fullWidth disabled={disabled} />
      </Grid>
      <Grid size={12}>
        <TextField required multiline minRows={3} id="description" name="description" label="Descrição" value={values.descricao} onChange={(event) => onChange("descricao", event.target.value)} fullWidth disabled={disabled} />
      </Grid>
      <Grid size={12}>
        <TextField
          required
          type="number"
          id="preco"
          name="preco"
          label="Preço"
          value={values.preco}
          onChange={(event) => onChange("preco", event.target.value)}
          fullWidth
          disabled={disabled}
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
        />
      </Grid>
      <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" disabled={disabled || saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Grid>
    </Grid>
  </Box>
);

export default ProductForm;
