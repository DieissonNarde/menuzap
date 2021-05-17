import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../Title';

// Generate Order Data
function createData(id, data, nome, mesa, metodoPagamento, status) {
  return { id, data, nome, mesa, metodoPagamento, status };
}

const rows = [
  createData(0, '16 Mar, 2019', 'Elvis Presley', '01', 'Dinheiro', 'pendente'),
  createData(1, '16 Mar, 2019', 'Paul McCartney', '02, UK', 'Crédito', 'preparando'),
  createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'Débito', 'Á caminho'),
  createData(3, '16 Mar, 2019', 'Michael Jackson', '03', 'Débito', 'pendente'),
  createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'Dinherio', 'pronto'),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Pedidos() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Pedidos</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Nome Cliente</TableCell>
            <TableCell>Mesa/Entregar</TableCell>
            <TableCell>Método Pagamento</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.data}</TableCell>
              <TableCell>{row.nome}</TableCell>
              <TableCell>{row.mesa}</TableCell>
              <TableCell>{row.metodoPagamento}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          Todos pedidos
        </Link>
      </div>
    </React.Fragment>
  );
}