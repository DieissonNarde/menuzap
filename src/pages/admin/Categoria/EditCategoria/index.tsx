import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../../components/FooterGer";
import ImagePicker from "../../../../components/ImagePicker";
import Menu from "../../../../components/Menu";
import {
  getCategoriaById,
  updateCategoria,
} from "../../../../services/parse/categoria.service";
import { getErrorMessage } from "../../../../util/errors";

const EditCategoria = () => {
  const navigate = useNavigate();
  const { idCategoria } = useParams<{ idCategoria: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategoria(): Promise<void> {
      try {
        if (!idCategoria) throw new Error("Categoria inválida.");
        const categoria = await getCategoriaById(idCategoria);
        if (active) setNome(categoria.nome);
      } catch (error) {
        if (active) setFeedback(`Não foi possível carregar a categoria: ${getErrorMessage(error)}`);
        if (import.meta.env.DEV) console.error("Erro ao carregar categoria", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCategoria();
    return () => {
      active = false;
    };
  }, [idCategoria]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFeedback("");
    setSaving(true);

    try {
      if (!idCategoria) throw new Error("Categoria inválida.");
      await updateCategoria(idCategoria, { nome, imagem: file });
      navigate("/categoria");
    } catch (error) {
      setFeedback(`Não foi possível salvar a categoria: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro ao atualizar categoria", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Editar categoria</Menu>
      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 7 }}>
            <Paper sx={{ p: 3.125 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={12}><ImagePicker file={file} onChange={setFile} label="Substituir imagem" /></Grid>
                  <Grid size={12}>
                    <TextField required id="nome" name="nome" label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} fullWidth disabled={loading} />
                  </Grid>
                  <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit" variant="contained" disabled={loading || saving}>
                      {saving ? "Salvando..." : "Salvar"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              {feedback && <Alert severity="error" sx={{ mt: 2 }}>{feedback}</Alert>}
            </Paper>
          </Grid>
        </Container>
        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default EditCategoria;
