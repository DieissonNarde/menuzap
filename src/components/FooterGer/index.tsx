import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const Copyright = () => (
  <Typography variant="body2" color="text.secondary">
    Copyright ©{" "}
    <Link color="inherit" href="https://upplaycompany.com.br/">
      upPlay Company
    </Link>{" "}
    {new Date().getFullYear()}.
  </Typography>
);

const FooterGer = () => (
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Box component="footer" sx={{ py: 2, mt: "auto", textAlign: "center" }}>
      <Container maxWidth="sm">
        <Typography variant="body1">Menu Zap</Typography>
        <Copyright />
      </Container>
    </Box>
  </Box>
);

export default FooterGer;
