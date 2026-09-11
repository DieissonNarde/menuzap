import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchProdutosByCategoriaId } from "../../services/parse/produto.service";
import type { Produto } from "../../types/domain";
import { getErrorMessage } from "../../util/errors";
import { formatPrice } from "../../util/format";

interface CardProdutosProps {
  value: string;
}

const CardProdutos = ({ value: categoriaId }: CardProdutosProps) => {
  const { subdominio } = useParams<{ subdominio: string }>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProdutos(): Promise<void> {
      if (!categoriaId) {
        setProdutos([]);
        return;
      }

      try {
        const loadedProdutos = await fetchProdutosByCategoriaId(categoriaId);
        if (active) {
          setProdutos(loadedProdutos);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setProdutos([]);
          setError(`Não foi possível carregar os produtos: ${getErrorMessage(loadError)}`);
        }
        if (import.meta.env.DEV) console.error("Erro ao carregar produtos", loadError);
      }
    }

    void loadProdutos();
    return () => {
      active = false;
    };
  }, [categoriaId]);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container spacing={3}>
      {produtos.length === 0 ? (
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography gutterBottom variant="h5" component="h2">
            Categoria vazia
          </Typography>
        </Grid>
      ) : (
        produtos.map((produto) => (
          <Grid key={produto.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Link to={subdominio ? `/${subdominio}/menu/item/${produto.id}` : "/"}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia sx={{ pt: "56.25%" }} image={produto.imagem} title={produto.nome} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography sx={{ display: "flex", justifyContent: "space-between" }} gutterBottom variant="h5" component="h2">
                    <span>{produto.nome}</span>
                    <span style={{ fontWeight: "bold", color: "green", fontSize: 22 }}>
                      {formatPrice(produto.preco)}
                    </span>
                  </Typography>
                  <Typography>{produto.descricao}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default CardProdutos;
