import Alert, { type AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Cep from "cep-promise";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

import Footer from "../../../components/FooterGer";
import Menu from "../../../components/Menu";
import {
  fetchEmpresaForCurrentUser,
  updateCurrentEmpresa,
} from "../../../services/parse/empresa.service";
import type { Empresa } from "../../../types/domain";
import { getErrorMessage } from "../../../util/errors";
import ProfileForm, {
  type EmpresaFormField,
  type EmpresaFormValues,
} from "./ProfileForm";

type TextInputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Feedback {
  severity: AlertColor;
  message: string;
}

const EMPTY_FORM: EmpresaFormValues = {
  nome: "",
  cnpj: "",
  celular: "",
  telefone: "",
  email: "",
  inicioSemanaAberto: "segunda",
  fimSemanaAberto: "sexta",
  inicioHorarioNormal: "",
  fimHorarioNormal: "",
  inicioHorarioFeriado: "",
  fimHorarioFeriado: "",
  cep: "",
  uf: "",
  cidade: "",
  logradouro: "",
  bairro: "",
  numero: "",
};

function toFormValues(empresa: Empresa): EmpresaFormValues {
  return {
    nome: empresa.nome,
    cnpj: empresa.cnpj,
    celular: empresa.celular,
    telefone: empresa.telefone,
    email: empresa.email,
    inicioSemanaAberto: empresa.inicioSemanaAberto,
    fimSemanaAberto: empresa.fimSemanaAberto,
    inicioHorarioNormal: empresa.inicioHorarioNormal,
    fimHorarioNormal: empresa.fimHorarioNormal,
    inicioHorarioFeriado: empresa.inicioHorarioFeriado,
    fimHorarioFeriado: empresa.fimHorarioFeriado,
    cep: empresa.cep,
    uf: empresa.uf,
    cidade: empresa.cidade,
    logradouro: empresa.logradouro,
    bairro: empresa.bairro,
    numero: empresa.numero,
  };
}

const Profile = () => {
  const [values, setValues] = useState<EmpresaFormValues>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const cepRequest = useRef(0);

  useEffect(() => {
    let active = true;

    async function loadEmpresa(): Promise<void> {
      try {
        const empresa = await fetchEmpresaForCurrentUser();
        if (!active) return;

        if (!empresa) {
          setFeedback({ severity: "error", message: "Empresa não encontrada para o usuário atual." });
          return;
        }

        setValues(toFormValues(empresa));
        setLoaded(true);
      } catch (error) {
        if (!active) return;
        setFeedback({
          severity: "error",
          message: `Não foi possível carregar a empresa: ${getErrorMessage(error)}`,
        });
        if (import.meta.env.DEV) console.error("Erro ao carregar dados da empresa", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEmpresa();
    return () => {
      active = false;
      cepRequest.current += 1;
    };
  }, []);

  const handleFieldChange = (field: EmpresaFormField) => (
    event: { target: { value: string } },
  ): void => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  function clearAddress(): void {
    setValues((current) => ({
      ...current,
      uf: "",
      cidade: "",
      logradouro: "",
      bairro: "",
    }));
  }

  function handleCep(event: TextInputEvent): void {
    const value = event.target.value;
    setValues((current) => ({ ...current, cep: value }));
    const requestId = ++cepRequest.current;

    if (value.replace(/\D/g, "").length !== 8) {
      clearAddress();
      return;
    }

    void Cep(value)
      .then((response) => {
        if (requestId !== cepRequest.current) return;
        setValues((current) => ({
          ...current,
          uf: response.state ?? "",
          cidade: response.city ?? "",
          logradouro: response.street ?? "",
          bairro: response.neighborhood ?? "",
        }));
      })
      .catch((error: unknown) => {
        if (requestId !== cepRequest.current) return;
        clearAddress();
        setFeedback({ severity: "warning", message: "CEP não encontrado. Preencha o endereço manualmente." });
        if (import.meta.env.DEV) console.error("Erro ao consultar CEP", error);
      });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const empresa = await updateCurrentEmpresa({ ...values, logo: file });
      setValues(toFormValues(empresa));
      setFile(null);
      setFeedback({ severity: "success", message: "Dados da empresa atualizados." });
    } catch (error) {
      setFeedback({
        severity: "error",
        message: `Não foi possível atualizar a empresa: ${getErrorMessage(error)}`,
      });
      if (import.meta.env.DEV) console.error("Erro ao atualizar empresa", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Menu>Minha Conta</Menu>

      <Box component="main" sx={{ flexGrow: 1, minHeight: "100vh", overflow: "auto" }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
          <Grid sx={{ m: "auto" }} size={{ xs: 12, sm: 9 }}>
            <Paper sx={{ p: 3.125, display: "flex", overflow: "auto", flexDirection: "column" }}>
              <Typography variant="h5" component="h1">
                Dados da Empresa
              </Typography>

              {loading && <CircularProgress size={28} sx={{ alignSelf: "center", my: 4 }} />}
              {!loading && loaded && (
                <ProfileForm
                  values={values}
                  file={file}
                  saving={saving}
                  onFieldChange={handleFieldChange}
                  onCepChange={handleCep}
                  onFileChange={setFile}
                  onSubmit={handleSubmit}
                />
              )}
              {feedback && (
                <Alert severity={feedback.severity} sx={{ mt: 2 }}>
                  {feedback.message}
                </Alert>
              )}
            </Paper>
          </Grid>
        </Container>

        <Box sx={{ pt: 4 }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
