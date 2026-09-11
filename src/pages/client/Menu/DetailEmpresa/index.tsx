import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Footer from "../../../../components/FooterGer";
import MenuClient from "../../../../components/MenuClient";
import { fetchEmpresaBySubdominio } from "../../../../services/parse/empresa.service";
import type { Empresa } from "../../../../types/domain";
import { getErrorMessage } from "../../../../util/errors";

const DetailEmpresa = () => {
  const { subdominio } = useParams<{ subdominio: string }>();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEmpresa(): Promise<void> {
      try {
        const loadedEmpresa = await fetchEmpresaBySubdominio(subdominio);
        if (!loadedEmpresa) throw new Error("Estabelecimento não encontrado.");

        if (active) {
          setEmpresa(loadedEmpresa);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setEmpresa(null);
          setError(`Não foi possível carregar a empresa: ${getErrorMessage(loadError)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar dados da empresa", loadError);
      }
    }

    void loadEmpresa();
    return () => {
      active = false;
    };
  }, [subdominio]);

  return (
    <Box sx={{ display: "flex" }}>
      <MenuClient>Empresa</MenuClient>

      <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid container spacing={3}>
            <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 8 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Paper sx={{ p: 3.5, display: "flex", overflow: "auto", flexDirection: "column" }}>
                {empresa ? (
                  <Grid container spacing={3}>
                    <Grid container spacing={3} size={12} sx={{ justifyContent: "center" }}>
                      <Avatar alt={`Logo ${empresa.nome}`} src={empresa.logo} sx={{ width: 88, height: 88 }} />
                      <Grid size={12}>
                        <Typography sx={{ textAlign: "center", fontWeight: "bold" }} gutterBottom variant="h3" component="h1">
                          {empresa.nome}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container size={12} sx={{ justifyContent: "center", textAlign: "center" }}>
                      <Grid size={12}>
                        <Typography sx={{ mt: 1.875, fontWeight: 500 }} variant="h5">Horário de funcionamento</Typography>
                        <Typography color="text.secondary" variant="h6">
                          {empresa.inicioSemanaAberto} a {empresa.fimSemanaAberto}
                        </Typography>
                        <Typography color="text.secondary" variant="h6">
                          {empresa.inicioHorarioNormal} às {empresa.fimHorarioNormal}
                        </Typography>
                      </Grid>

                      <Grid size={12}>
                        <Typography sx={{ mt: 1.875, fontWeight: 500 }} variant="h5">Feriados</Typography>
                        <Typography color="text.secondary" variant="h6">
                          {empresa.inicioHorarioFeriado} às {empresa.fimHorarioFeriado}
                        </Typography>
                      </Grid>

                      <Grid size={12}>
                        <Typography sx={{ mt: 1.875, fontWeight: 500 }} variant="h5">Contato</Typography>
                        <Typography color="text.secondary" variant="h6">
                          {[empresa.celular, empresa.telefone].filter(Boolean).join(" / ") || "Não informado"}
                        </Typography>
                        <Typography color="text.secondary" variant="h6">
                          {empresa.email || "E-mail não informado"}
                        </Typography>
                      </Grid>

                      <Grid size={12}>
                        <Typography sx={{ mt: 1.875, fontWeight: 500 }} variant="h5">Endereço</Typography>
                        <Typography color="text.secondary" variant="h6">
                          {[empresa.cidade, empresa.uf].filter(Boolean).join(" / ") || "Não informado"}
                        </Typography>
                        <Typography color="text.secondary" variant="h6">
                          {[empresa.logradouro, empresa.bairro, empresa.numero].filter(Boolean).join(", ")}
                        </Typography>
                        <Typography color="text.secondary" variant="h6">{empresa.cep}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : !error ? (
                  <Typography align="center">Carregando empresa...</Typography>
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

export default DetailEmpresa;
