import type { PaymentDetails, RegistrationDetails } from "./types";

export function validateRegistration(values: RegistrationDetails): string | null {
  if (Object.values(values).some((value) => !value.trim())) {
    return "Preencha todos os dados obrigatórios do cadastro.";
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    return "Informe um endereço de e-mail válido.";
  }

  return null;
}

export function validatePayment(values: PaymentDetails): string | null {
  if (Object.values(values).some((value) => !value.trim())) {
    return "Preencha todos os dados demonstrativos de pagamento.";
  }

  return null;
}
