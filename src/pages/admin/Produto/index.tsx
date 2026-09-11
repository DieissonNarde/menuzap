import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ConfirmDialog from "../../../components/ConfirmDialog";
import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import {
  deleteProduto,
  fetchProdutosByCategoriaId,
} from "../../../services/parse/produto.service";
import type { Produto as ProdutoDto } from "../../../types/domain";
import { getErrorMessage } from "../../../util/errors";
import { formatPrice } from "../../../util/format";

const Produto = () => {
  const { idCategoria } = useParams<{ idCategoria: string }>();
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<ProdutoDto | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProdutos(): Promise<void> {
      try {
        if (!idCategoria) throw new Error("Categoria inválida.");
        const loadedProdutos = await fetchProdutosByCategoriaId(idCategoria);
        if (active) {
          setProdutos(loadedProdutos);
          setFeedback("");
        }
      } catch (error) {
        if (active) {
          setProdutos([]);
          setFeedback(`Não foi possível carregar os produtos: ${getErrorMessage(error)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar produtos", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProdutos();
    return () => {
      active = false;
    };
  }, [idCategoria]);

  async function handleDelete(): Promise<void> {
    if (!produtoParaExcluir) return;

    setDeleting(true);
    setFeedback("");
    try {
      await deleteProduto(produtoParaExcluir.id);
      setProdutos((current) => current.filter(({ id }) => id !== produtoParaExcluir.id));
      setProdutoParaExcluir(null);
    } catch (error) {
      setFeedback(`Não foi possível excluir o produto: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro ao excluir produto", error);
    } finally {
      setDeleting(false);
    }
  }

  const basePath = idCategoria ? `/categoria/${idCategoria}/produto` : "/categoria";

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Produtos</Menu>
      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={3} sx={{ justifyContent: "flex-end" }}>
            <Grid>
              <Button component={Link} to={`${basePath}/new`} size="large" variant="contained">
                Novo produto
              </Button>
            </Grid>
          </Grid>
          {feedback && <Alert severity="error" sx={{ mb: 2 }}>{feedback}</Alert>}
          <Grid container spacing={3}>
            {loading ? (
              <Grid size={12}><Typography align="center">Carregando produtos...</Typography></Grid>
            ) : produtos.length === 0 ? (
              <Grid size={12}><Typography align="center" variant="h5">Categoria vazia</Typography></Grid>
            ) : (
              produtos.map((produto) => (
                <Grid key={produto.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardMedia sx={{ pt: "56.25%" }} image={produto.imagem} title={produto.nome} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography sx={{ display: "flex", justifyContent: "space-between" }} gutterBottom variant="h5">
                        <span>{produto.nome}</span>
                        <span style={{ fontWeight: "bold" }}>{formatPrice(produto.preco)}</span>
                      </Typography>
                      <Typography>{produto.descricao}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button component={Link} to={`${basePath}/edit/${produto.id}`} size="small">Editar</Button>
                      <Button size="small" color="error" onClick={() => setProdutoParaExcluir(produto)}>Remover</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
      <ConfirmDialog
        open={Boolean(produtoParaExcluir)}
        title="Remover produto"
        description={`Deseja remover o produto ${produtoParaExcluir?.nome ?? "selecionado"}? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={deleting}
        onClose={() => setProdutoParaExcluir(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Produto;
