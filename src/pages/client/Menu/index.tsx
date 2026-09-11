import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { type SyntheticEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import CardProdutos from "../../../components/CardProdutos";
import Footer from "../../../components/FooterGer";
import MenuClient from "../../../components/MenuClient";
import { fetchCategoriasByEmpresaId } from "../../../services/parse/categoria.service";
import { fetchEmpresaBySubdominio } from "../../../services/parse/empresa.service";
import type { Categoria, Empresa } from "../../../types/domain";
import { getErrorMessage } from "../../../util/errors";

const Menu = () => {
  const { subdominio } = useParams<{ subdominio: string }>();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMenu(): Promise<void> {
      try {
        const loadedEmpresa = await fetchEmpresaBySubdominio(subdominio);
        if (!loadedEmpresa) throw new Error("Estabelecimento não encontrado.");

        const loadedCategorias = await fetchCategoriasByEmpresaId(loadedEmpresa.id);
        if (active) {
          setEmpresa(loadedEmpresa);
          setCategorias(loadedCategorias);
          setSelectedCategory(loadedCategorias[0]?.id ?? "");
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setEmpresa(null);
          setCategorias([]);
          setSelectedCategory("");
          setError(`Não foi possível carregar o cardápio: ${getErrorMessage(loadError)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar o cardápio", loadError);
      }
    }

    void loadMenu();
    return () => {
      active = false;
    };
  }, [subdominio]);

  const handleChange = (_event: SyntheticEvent, newValue: string): void => {
    setSelectedCategory(newValue);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Menu</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={3}>
            <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 10 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Paper sx={{ p: 3.5, display: "flex", overflow: "auto", flexDirection: "column" }}>
                <Link to={subdominio ? `/${subdominio}/empresa` : "/"}>
                  <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                    <Grid>
                      <Avatar alt={`Logo ${empresa?.nome ?? "da empresa"}`} src={empresa?.logo ?? ""} sx={{ width: 88, height: 88 }} />
                    </Grid>
                    <Grid size={12}>
                      <Typography sx={{ textAlign: "center", fontWeight: "bold" }} gutterBottom variant="h3" component="h2">
                        {empresa?.nome ?? "Cardápio"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Link>
                <Typography sx={{ color: "text.secondary", fontSize: 18, fontWeight: "bold", mt: 1.5, textAlign: "center" }}>
                  Consulte os horários do estabelecimento
                </Typography>
              </Paper>

              <TabContext value={selectedCategory}>
                <AppBar position="static">
                  <TabList onChange={handleChange} aria-label="Categorias do cardápio">
                    {categorias.length === 0 ? (
                      <Tab label="Sem categorias" value="" />
                    ) : (
                      categorias.map((categoria) => (
                        <Tab key={categoria.id} label={categoria.nome} value={categoria.id} />
                      ))
                    )}
                  </TabList>
                </AppBar>
                {categorias.length === 0 ? (
                  <TabPanel value="">
                    <Typography align="center" gutterBottom variant="h5" component="h2">
                      Cardápio vazio
                    </Typography>
                  </TabPanel>
                ) : (
                  categorias.map((categoria) => (
                    <TabPanel key={categoria.id} value={categoria.id}>
                      <CardProdutos value={categoria.id} />
                    </TabPanel>
                  ))
                )}
              </TabContext>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ pt: 4 }}><Footer /></Box>
      </Box>
    </Box>
  );
};

export default Menu;
