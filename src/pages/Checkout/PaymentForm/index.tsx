import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import type { CheckoutChangeHandler, PaymentDetails } from "../types";

interface PaymentFormProps {
  values: PaymentDetails;
  onChange: CheckoutChangeHandler<PaymentDetails>;
}

const PaymentForm = ({ values, onChange }: PaymentFormProps) => (
  <>
    <Typography variant="h6" gutterBottom>
      Dados de Pagamento
    </Typography>
    <Alert severity="info" sx={{ mb: 3 }}>
      Cobrança demonstrativa: nenhum pagamento real será processado e os dados não serão armazenados.
    </Alert>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          required
          id="cardName"
          label="Nome no Cartão"
          value={values.cardName}
          onChange={onChange("cardName")}
          fullWidth
          autoComplete="cc-name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          required
          id="cardNumber"
          label="Número do Cartão"
          value={values.cardNumber}
          onChange={onChange("cardNumber")}
          fullWidth
          inputMode="numeric"
          autoComplete="cc-number"
          slotProps={{ htmlInput: { maxLength: 23 } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          required
          id="expDate"
          label="Data de Validade"
          value={values.expDate}
          onChange={onChange("expDate")}
          fullWidth
          autoComplete="cc-exp"
          placeholder="MM/AA"
          slotProps={{ htmlInput: { maxLength: 7 } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          required
          id="cvv"
          label="CVV"
          type="password"
          value={values.cvv}
          onChange={onChange("cvv")}
          helperText="Três ou quatro dígitos de segurança"
          fullWidth
          inputMode="numeric"
          autoComplete="cc-csc"
          slotProps={{ htmlInput: { maxLength: 4 } }}
        />
      </Grid>
    </Grid>
  </>
);

export default PaymentForm;
