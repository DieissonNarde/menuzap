import StarIcon from "@mui/icons-material/StarBorder";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

import { SUBSCRIPTION_PLANS } from "../../constants/subscriptionPlans";
import { formatPrice } from "../../util/format";

const Planos = () => (
  <>
    <CssBaseline />
    <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }} />
    <Container maxWidth="md" component="main">
      <Typography id="planos" variant="h4" component="h2" className="text-center">
        PLANOS
      </Typography>
      <Grid container spacing={5} sx={{ alignItems: "flex-end" }}>
        {SUBSCRIPTION_PLANS.map((tier) => (
          <Grid key={tier.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ mt: 10, mb: 20 }}>
              <CardHeader
                title={tier.title}
                subheader={tier.popular ? "Mais Popular" : undefined}
                titleTypographyProps={{ align: "center" }}
                subheaderTypographyProps={{ align: "center" }}
                action={tier.popular ? <StarIcon /> : null}
                sx={(theme) => ({
                  backgroundColor: theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
                })}
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", mb: 2 }}>
                  <Typography component="h3" variant="h3" color="text.primary">
                    {formatPrice(tier.price)}
                  </Typography>
                </Box>
                <ul>
                  {tier.description.map((line) => (
                    <Typography component="li" variant="subtitle1" align="center" key={line}>
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={`/checkout?plano=${tier.id}`}
                  fullWidth
                  variant={tier.popular ? "contained" : "outlined"}
                  color="primary"
                >
                  ASSINE
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </>
);

export default Planos;
