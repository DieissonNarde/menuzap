import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ButtonMaterial from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ConfirmDialog from "../../../components/ConfirmDialog";
import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import {
  deleteCategoria,
  fetchCategoriasForCurrentUser,
} from "../../../services/parse/categoria.service";
import type { Categoria as CategoriaDto } from "../../../types/domain";
import { getErrorMessage } from "../../../util/errors";

const Categoria = () => {
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<CategoriaDto | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategorias(): Promise<void> {
      try {
        const loadedCategorias = await fetchCategoriasForCurrentUser();
        if (active) {
          setCategorias(loadedCategorias);
          setFeedback("");
        }
      } catch (error) {
        if (active) {
          setCategorias([]);
          setFeedback(`Não foi possível carregar as categorias: ${getErrorMessage(error)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar categorias", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCategorias();
    return () => {
      active = false;
    };
  }, []);

  async function handleDelete(): Promise<void> {
    if (!categoriaParaExcluir) return;

    setDeleting(true);
    setFeedback("");
    try {
      await deleteCategoria(categoriaParaExcluir.id);
      setCategorias((current) => current.filter(({ id }) => id !== categoriaParaExcluir.id));
      setCategoriaParaExcluir(null);
    } catch (error) {
      setFeedback(`Não foi possível excluir a categoria: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro ao excluir categoria", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Categorias</Menu>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={4} sx={{ justifyContent: "flex-end" }}>
            <Grid>
              <ButtonMaterial component={Link} to="/categoria/new" size="large" variant="contained">
                Nova categoria
              </ButtonMaterial>
            </Grid>
          </Grid>
          {feedback && <Alert severity="error" sx={{ mb: 2 }}>{feedback}</Alert>}
          <Grid container spacing={4}>
            {loading ? (
              <Grid size={12}><Typography align="center">Carregando categorias...</Typography></Grid>
            ) : categorias.length === 0 ? (
              <Grid size={12}><Typography align="center" variant="h5">Cardápio vazio</Typography></Grid>
            ) : (
              categorias.map((categoria) => (
                <Grid key={categoria.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardMedia sx={{ pt: "56.25%" }} image={categoria.imagem} title={categoria.nome} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <ButtonMaterial component={Link} to={`/categoria/${categoria.id}/produto`}>
                        {categoria.nome}
                      </ButtonMaterial>
                    </CardContent>
                    <CardActions>
                      <ButtonMaterial component={Link} to={`/categoria/edit/${categoria.id}`} size="small">
                        Editar
                      </ButtonMaterial>
                      <ButtonMaterial size="small" color="error" onClick={() => setCategoriaParaExcluir(categoria)}>
                        Remover
                      </ButtonMaterial>
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
        open={Boolean(categoriaParaExcluir)}
        title="Remover categoria"
        description={`Deseja remover a categoria ${categoriaParaExcluir?.nome ?? "selecionada"}? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={deleting}
        onClose={() => setCategoriaParaExcluir(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default Categoria;
