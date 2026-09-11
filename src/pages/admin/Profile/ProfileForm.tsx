import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import type { SelectChangeEvent } from "@mui/material/Select";
import type { ChangeEvent, FormEvent } from "react";

import ImagePicker from "../../../components/ImagePicker";
import { InputCnpj, InputPhone } from "../../../components/InputMasks";
import type { UpdateEmpresaInput } from "../../../services/parse/empresa.service";
import AddressFields from "./AddressFields";
import BusinessHours from "./BusinessHours";

export type EmpresaFormValues = Omit<UpdateEmpresaInput, "logo">;
export type EmpresaFormField = keyof EmpresaFormValues;

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FieldChangeEvent = TextInputEvent | SelectChangeEvent<string>;

interface ProfileFormProps {
  values: EmpresaFormValues;
  file: File | null;
  saving: boolean;
  disabled?: boolean;
  onFieldChange: (field: EmpresaFormField) => (event: FieldChangeEvent) => void;
  onCepChange: (event: TextInputEvent) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ProfileForm = ({
  values,
  file,
  saving,
  disabled = false,
  onFieldChange,
  onCepChange,
  onFileChange,
  onSubmit,
}: ProfileFormProps) => (
  <form onSubmit={onSubmit}>
    <Grid container spacing={3}>
      <Grid size={12} sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
        <ImagePicker file={file} onChange={onFileChange} label="Selecionar logo" />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          id="name"
          name="name"
          label="Nome"
          value={values.nome}
          onChange={onFieldChange("nome")}
          fullWidth
          required
          autoComplete="organization"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputCnpj value={values.cnpj} onChange={onFieldChange("cnpj")} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputPhone value={values.celular} onChange={onFieldChange("celular")} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <InputPhone label="Telefone" value={values.telefone} onChange={onFieldChange("telefone")} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          type="email"
          id="email"
          name="email"
          label="E-mail"
          value={values.email}
          onChange={onFieldChange("email")}
          fullWidth
          autoComplete="email"
        />
      </Grid>

      <BusinessHours
        startDay={values.inicioSemanaAberto}
        endDay={values.fimSemanaAberto}
        onStartDayChange={onFieldChange("inicioSemanaAberto")}
        onEndDayChange={onFieldChange("fimSemanaAberto")}
        normalStart={values.inicioHorarioNormal}
        normalEnd={values.fimHorarioNormal}
        onNormalStartChange={onFieldChange("inicioHorarioNormal")}
        onNormalEndChange={onFieldChange("fimHorarioNormal")}
        holidayStart={values.inicioHorarioFeriado}
        holidayEnd={values.fimHorarioFeriado}
        onHolidayStartChange={onFieldChange("inicioHorarioFeriado")}
        onHolidayEndChange={onFieldChange("fimHorarioFeriado")}
      />

      <AddressFields
        cep={values.cep}
        uf={values.uf}
        cidade={values.cidade}
        logradouro={values.logradouro}
        bairro={values.bairro}
        numero={values.numero}
        onCepChange={onCepChange}
        onUfChange={onFieldChange("uf")}
        onCidadeChange={onFieldChange("cidade")}
        onLogradouroChange={onFieldChange("logradouro")}
        onBairroChange={onFieldChange("bairro")}
        onNumeroChange={onFieldChange("numero")}
      />

      <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" variant="contained" color="success" disabled={disabled || saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Grid>
    </Grid>
  </form>
);

export default ProfileForm;
