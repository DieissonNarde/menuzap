import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import type { SubscriptionPlan } from "../../../constants/subscriptionPlans";
import { formatPrice } from "../../../util/format";
import type { PaymentDetails, RegistrationDetails } from "../types";

interface OrderProps {
  plan: SubscriptionPlan;
  registration: RegistrationDetails;
  payment: PaymentDetails;
}

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  return digits ? `•••• ${digits.slice(-4)}` : "—";
}

const Order = ({ plan, registration, payment }: OrderProps) => (
  <>
    <Typography variant="h6" gutterBottom>
      Resumo da Assinatura
    </Typography>
    <Alert severity="info" sx={{ mb: 2 }}>
      Esta é uma cobrança demonstrativa. Nenhum valor será debitado.
    </Alert>
    <List disablePadding>
      <ListItem sx={{ py: 1 }}>
        <ListItemText primary={`Plano ${plan.title}`} secondary={plan.description[0]} />
        <Typography variant="body2">{formatPrice(plan.price)}</Typography>
      </ListItem>
      <ListItem sx={{ py: 1 }}>
        <ListItemText primary="Total demonstrativo" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {formatPrice(plan.price)}
        </Typography>
      </ListItem>
    </List>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Dados de Registro
        </Typography>
        <Typography gutterBottom>{registration.nome || "—"}</Typography>
        <Typography gutterBottom>{registration.email || "—"}</Typography>
      </Grid>
      <Grid container size={{ xs: 12, sm: 6 }} sx={{ flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Dados de Pagamento
        </Typography>
        <Grid container>
          {[
            { name: "Nome no Cartão", detail: payment.cardName },
            { name: "Número do Cartão", detail: maskCardNumber(payment.cardNumber) },
            { name: "Validade", detail: payment.expDate },
          ].map((item) => (
            <Grid container size={12} key={item.name}>
              <Grid size={6}>
                <Typography gutterBottom>{item.name}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography gutterBottom>{item.detail || "—"}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </>
);

export default Order;
