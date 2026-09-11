import { describe, expect, it } from "vitest";

import { getSubscriptionPlan } from "../../constants/subscriptionPlans";
import type { PaymentDetails, RegistrationDetails } from "./types";
import { validatePayment, validateRegistration } from "./validation";

const validRegistration: RegistrationDetails = {
  nome: "Ana",
  username: "ana",
  email: "ana@example.com",
  password: "segredo",
};

const validPayment: PaymentDetails = {
  cardName: "Ana Silva",
  cardNumber: "4111 1111 1111 1111",
  expDate: "12/30",
  cvv: "123",
};

describe("validação do checkout demonstrativo", () => {
  it("aceita um cadastro e pagamento preenchidos", () => {
    expect(validateRegistration(validRegistration)).toBeNull();
    expect(validatePayment(validPayment)).toBeNull();
  });

  it("rejeita cadastro incompleto ou e-mail inválido", () => {
    expect(validateRegistration({ ...validRegistration, nome: "" })).toMatch(/obrigatórios/);
    expect(validateRegistration({ ...validRegistration, email: "email-invalido" })).toMatch(/e-mail válido/);
  });

  it("exige todos os campos demonstrativos de pagamento", () => {
    expect(validatePayment({ ...validPayment, cvv: "" })).toMatch(/demonstrativos/);
  });

  it("resolve o plano selecionado e usa o mensal como padrão seguro", () => {
    expect(getSubscriptionPlan("anual").id).toBe("anual");
    expect(getSubscriptionPlan("plano-inexistente").id).toBe("mensal");
    expect(getSubscriptionPlan(null).id).toBe("mensal");
  });
});
