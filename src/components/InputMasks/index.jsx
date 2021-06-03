import React from "react";
import InputMask from "react-input-mask";
import MaterialInput from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';

// INPUT PARA CEP / POSTAL CODE
export const InputCep = (props) => (
  <InputMask mask="99999-999" value={props.value} onChange={props.onChange}>
    {(inputProps) => <TextField
      {...inputProps}
      required
      type="tel"
      label="Cep"
      fullWidth
      autoComplete="name"
    />}
  </InputMask>
);

// INPUT PARA CPF / PESSOA FÍSICA
export const InputCpf = (props) => (
  <InputMask mask="999.999.999-99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <MaterialInput {...inputProps} placeholder="CPF" type="tel" />}
  </InputMask>
)

// INPUT PARA CNPJ / PESSOA JURÍDICA
export const InputCnpj = (props) => (
  <InputMask mask="99.999.999/9999-99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <MaterialInput {...inputProps} placeholder="CNPJ" type="tel" />}
  </InputMask>
)

// INPUT PARA CELULAR / TELEFONE
export const InputPhone = (props) => (
  <InputMask mask="(99) 9 9999-9999" value={props.value} onChange={props.onChange}>
    {(inputProps) => <MaterialInput {...inputProps} placeholder="Celular" type="tel" />}
  </InputMask>
)

// INPUT PARA PREÇO / VALOR MONETÁRIO PADRÃO BR
export const InputPrice = (props) => (
  <InputMask mask="999.999,99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <MaterialInput {...inputProps} placeholder="Preço" type="tel" />}
  </InputMask>
)

// INPUT PARA HORAS
export const InputHour = (props) => (
  <InputMask mask="99:99" value={props.value} onChange={props.onChange}>
    {(inputProps) => <MaterialInput {...inputProps} placeholder="Horas" type="tel" />}
  </InputMask>
)