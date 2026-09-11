import type { ChangeEvent } from "react";

import type { CadastroUsuarioInput } from "../../types/domain";

export type RegistrationDetails = CadastroUsuarioInput;

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
}

export type CheckoutInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type CheckoutChangeHandler<T> = (
  field: keyof T,
) => (event: CheckoutInputEvent) => void;

export const EMPTY_REGISTRATION: RegistrationDetails = {
  nome: "",
  username: "",
  email: "",
  password: "",
};

export const EMPTY_PAYMENT: PaymentDetails = {
  cardName: "",
  cardNumber: "",
  expDate: "",
  cvv: "",
};
