import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Footer from "../../../../components/FooterGer";
import MenuClient from "../../../../components/MenuClient";
import { useCart } from "../../../../hooks/useCart";
import { getProdutoById } from "../../../../services/parse/produto.service";
import type { Produto } from "../../../../types/domain";
import { getErrorMessage } from "../../../../util/errors";
import { formatPrice } from "../../../../util/format";

const DetailProduto = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [error, setError] = useState("");
  const { addProduct } = useCart();

  useEffect(() => {
    let active = true;

    async function loadProduto(): Promise<void> {
      if (!id) {
        setError("Produto inválido.");
        return;
      }

      try {
        const loadedProduto = await getProdutoById(id);
        if (active) {
          setProduto(loadedProduto);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setProduto(null);
          setError(`Não foi possível carregar o produto: ${getErrorMessage(loadError)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar produto", loadError);
      }
    }

    void loadProduto();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Produto</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={3}>
            <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 9 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Paper sx={{ p: 3.5, display: "flex", overflow: "auto", flexDirection: "column" }}>
                {produto ? (
                  <Grid container spacing={3} sx={{ justifyContent: "flex-start" }}>
                    <Grid size={12}>
                      <CardMedia sx={{ pt: "56.25%", borderRadius: 5 }} image={produto.imagem} title={produto.nome} />
                    </Grid>
                    <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ textAlign: "center", fontWeight: 500, fontSize: 32 }} gutterBottom variant="h3" component="h2">
                        {produto.nome}
                      </Typography>
                      <Typography sx={{ fontSize: 18 }}>{produto.descricao}</Typography>
                    </CardContent>
                    <Grid container size={12} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Typography component="span" sx={{ fontWeight: "bold", ml: 1.5, color: "green", fontSize: 28 }}>
                        {formatPrice(produto.preco)}
                      </Typography>
                      <Button onClick={() => void addProduct(produto)} size="large" variant="contained">
                        Adicionar ao carrinho
                      </Button>
                    </Grid>
                  </Grid>
                ) : !error ? (
                  <Typography align="center">Carregando produto...</Typography>
                ) : null}
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default DetailProduto;
