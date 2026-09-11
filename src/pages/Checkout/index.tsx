import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { type ReactNode, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Footer from "../../components/FooterGer";
import Header from "../../components/Header";
import { getSubscriptionPlan } from "../../constants/subscriptionPlans";
import { registerOwner } from "../../services/parse/auth.service";
import { getErrorMessage } from "../../util/errors";
import Order from "./Order";
import PaymentForm from "./PaymentForm";
import type {
  CheckoutChangeHandler,
  PaymentDetails,
  RegistrationDetails,
} from "./types";
import { EMPTY_PAYMENT, EMPTY_REGISTRATION } from "./types";
import UserForm from "./UserForm";
import { validatePayment, validateRegistration } from "./validation";

const steps = ["Dados de Registro", "Dados de Pagamento", "Resumo da sua Assinatura"];

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const plan = getSubscriptionPlan(searchParams.get("plano"));
  const [activeStep, setActiveStep] = useState(0);
  const [registration, setRegistration] = useState<RegistrationDetails>(EMPTY_REGISTRATION);
  const [payment, setPayment] = useState<PaymentDetails>(EMPTY_PAYMENT);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRegistrationChange: CheckoutChangeHandler<RegistrationDetails> = (field) => (
    event,
  ) => {
    setRegistration((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePaymentChange: CheckoutChangeHandler<PaymentDetails> = (field) => (
    event,
  ) => {
    setPayment((current) => ({ ...current, [field]: event.target.value }));
  };

  function getStepContent(): ReactNode {
    switch (activeStep) {
      case 0:
        return <UserForm values={registration} onChange={handleRegistrationChange} />;
      case 1:
        return <PaymentForm values={payment} onChange={handlePaymentChange} />;
      case 2:
        return <Order plan={plan} registration={registration} payment={payment} />;
      default:
        return null;
    }
  }

  function handleNext(): void {
    const validationError = activeStep === 0
      ? validateRegistration(registration)
      : validatePayment(payment);

    if (validationError) {
      setFeedback(validationError);
      return;
    }

    setFeedback("");
    setActiveStep((currentStep) => Math.min(currentStep + 1, steps.length));
  }

  function handleBack(): void {
    setFeedback("");
    setActiveStep((currentStep) => Math.max(currentStep - 1, 0));
  }

  async function handleSignUp(): Promise<void> {
    const validationError = validateRegistration(registration) ?? validatePayment(payment);
    if (validationError) {
      setFeedback(validationError);
      return;
    }

    setSaving(true);
    setFeedback("");
    try {
      await registerOwner(registration);
      setRegistration((current) => ({ ...current, password: "" }));
      setPayment(EMPTY_PAYMENT);
      setActiveStep(steps.length);
    } catch (error) {
      setFeedback(`Não foi possível concluir o cadastro: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro no checkout", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <CssBaseline />
      <Header />

      <Box
        component="main"
        sx={(theme) => ({
          width: "auto",
          mx: 2,
          [theme.breakpoints.up("sm")]: { width: 600, mx: "auto" },
        })}
      >
        <Paper
          sx={(theme) => ({
            mt: 3,
            mb: 3,
            p: 2,
            [theme.breakpoints.up("sm")]: { mt: 6, mb: 6, p: 3 },
          })}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                Obrigado pela sua Assinatura.
              </Typography>
              <Typography variant="subtitle1">
                Seu cadastro demonstrativo foi concluído para o plano {plan.title}. Aproveite o acesso ilimitado por 15 dias grátis.
              </Typography>
            </>
          ) : (
            <>
              {getStepContent()}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button type="button" onClick={handleBack} disabled={saving} sx={{ mt: 3, ml: 1 }}>
                    Voltar
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => void handleSignUp()}
                    disabled={saving}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {saving ? "Salvando..." : "Confirmar demonstração"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Avançar
                  </Button>
                )}
              </Box>
              {feedback && (
                <Alert severity="error" sx={{ mt: 2 }} aria-live="polite">
                  {feedback}
                </Alert>
              )}
            </>
          )}
        </Paper>

        <Footer />
      </Box>
    </>
  );
};

export default Checkout;
