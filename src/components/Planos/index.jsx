import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  cards: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(20),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  }
}));

const tiers = [
  {
    title: 'Mensal',
    price: '55',
    description: ['Assinatura de 30 dias', 'Pedidos Ilimitados', 'Itens Ilimitados', 'Fotos nos Itens', 'Adicione Logo Marca', 'Adicione Plano de Fundo', 'Página de Contato', 'Imagens nos Itens', 'Cupom de Desconto'],
    buttonText: 'ASSINE',
    buttonVariant: 'outlined',
  },
  {
    title: 'Semestral',
    subheader: 'Mais Popular',
    price: '280',
    description: [
      'Assinatura de 6 meses',
      'Pedidos Ilimitados',
      'Itens Ilimitados',
      'Fotos nos Itens',
      'Adicione Logo Marca',
      'Adicione Plano de Fundo',
      'Página de Contato',
      'Imagens nos Itens',
      'Cupom de Desconto',
    ],
    buttonText: 'ASSINE',
    buttonVariant: 'contained',
  },
  {
    title: 'Anual',
    price: '480',
    description: [
      'Assinatura de 12 meses',
      'Pedidos Ilimitados',
      'Itens Ilimitados',
      'Fotos nos Itens',
      'Adicione Logo Marca',
      'Adicione Plano de Fundo',
      'Página de Contato',
      'Imagens nos Itens',
      'Cupom de Desconto',
    ],
    buttonText: 'ASSINE',
    buttonVariant: 'outlined',
  },
];


export default function Planos() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" component="main">
        <h2 className="text-center">PLANOS</h2>
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
              <Card className={classes.cards}>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <div className={classes.cardPricing}>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      /mo
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button href="/checkout" fullWidth variant={tier.buttonVariant} color="primary">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}