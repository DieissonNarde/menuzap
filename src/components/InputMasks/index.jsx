import React from "react";
import InputMask from "react-input-mask";
import TextField from '@material-ui/core/TextField';

// INPUT PARA CEP / POSTAL CODE
export const InputCep = (props) => (
  <InputMask mask="99999-999" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="CEP"
      fullWidth
      autoComplete="cep"
    />}
  </InputMask>
);

// INPUT PARA CPF / PESSOA FÍSICA
export const InputCpf = (props) => (
  <InputMask mask="999.999.999-99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="CPF"
      fullWidth
      autoComplete="cpf"
    />}
  </InputMask>
)

// INPUT PARA CNPJ / PESSOA JURÍDICA
export const InputCnpj = (props) => (
  <InputMask mask="99.999.999/9999-99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="CNPJ"
      fullWidth
      autoComplete="cnpj"
    />}
  </InputMask>
)

// INPUT PARA CELULAR / TELEFONE
export const InputPhone = (props) => (
  <InputMask mask="(99) 9 9999-9999" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="Celular"
      fullWidth
      autoComplete="celular"
    />}
  </InputMask>
)

// INPUT PARA PREÇO / VALOR MONETÁRIO PADRÃO BR
export const InputPrice = (props) => (
  <InputMask mask="999 999.99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="Preço"
      fullWidth
      autoComplete="price"
    />}
  </InputMask>
)

// INPUT PARA HORAS
export const InputHour = (props) => (
  <InputMask mask="99:99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      type="tel"
      label="Horas"
      fullWidth
      autoComplete="hour"
    />}
  </InputMask>
)