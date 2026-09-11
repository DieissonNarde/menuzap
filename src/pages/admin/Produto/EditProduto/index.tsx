import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../../components/FooterGer";
import Menu from "../../../../components/Menu";
import {
  getProdutoById,
  updateProduto,
} from "../../../../services/parse/produto.service";
import { getErrorMessage } from "../../../../util/errors";
import ProductForm, { type ProductFormValues } from "../ProductForm";

const INITIAL_VALUES: ProductFormValues = {
  nome: "",
  descricao: "",
  preco: "",
};

const EditProduto = () => {
  const navigate = useNavigate();
  const { idCategoria, idProduto } = useParams<{
    idCategoria: string;
    idProduto: string;
  }>();
  const [values, setValues] = useState<ProductFormValues>(INITIAL_VALUES);
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProduto(): Promise<void> {
      try {
        if (!idProduto) throw new Error("Produto inválido.");
        const produto = await getProdutoById(idProduto);
        if (active) {
          setValues({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: String(produto.preco),
          });
        }
      } catch (error) {
        if (active) setFeedback(`Não foi possível carregar o produto: ${getErrorMessage(error)}`);
        if (import.meta.env.DEV) console.error("Erro ao carregar produto", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProduto();
    return () => {
      active = false;
    };
  }, [idProduto]);

  const handleChange = (field: keyof ProductFormValues, value: string): void => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFeedback("");
    setSaving(true);

    try {
      if (!idCategoria || !idProduto) throw new Error("Produto ou categoria inválida.");
      await updateProduto(idProduto, {
        nome: values.nome,
        descricao: values.descricao,
        preco: Number(values.preco),
        imagem: file,
      });
      navigate(`/categoria/${idCategoria}/produto`);
    } catch (error) {
      setFeedback(`Não foi possível salvar o produto: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro ao atualizar produto", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Editar produto</Menu>
      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 7 }}>
            <Paper sx={{ p: 3.125 }}>
              <ProductForm
                values={values}
                file={file}
                saving={saving}
                disabled={loading}
                onChange={handleChange}
                onFileChange={setFile}
                onSubmit={handleSubmit}
              />
              {feedback && <Alert severity="error" sx={{ mt: 2 }}>{feedback}</Alert>}
            </Paper>
          </Grid>
        </Container>
        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default EditProduto;
