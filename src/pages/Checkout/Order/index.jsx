import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const planos = [
  { name: 'Mensal', price: '$ 55' },
  { name: 'Semestral', price: '$ 280' },
  { name: 'Anual', price: '$ 480' },
];

const email = ['teste@email.com.br'];
const payments = [
  { name: 'Card type', detail: 'Visa' },
  { name: 'Card holder', detail: 'Mr John Smith' },
  { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date', detail: '04/2024' },
];


const Order = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Resumo da Assinatura
      </Typography>
      <List disablePadding>
        {planos.map((plano) => (
          <ListItem className={classes.listItem} key={plano.name}>
            <ListItemText primary={plano.name} />
            <Typography variant="body2">{plano.price}</Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            $34.06
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Dados de Registro
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom>{email.join('')}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Dados de Pagamento
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Order;


const useStyles = makeStyles((theme) => ({
  listItem: {padding: theme.spacing(1, 0), },
  total: {fontWeight: 700, },
  title: {marginTop: theme.spacing(2), },
}));