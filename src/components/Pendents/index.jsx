import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Title from '../Title';


const Pendents = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Total Pedidos Pendentes</Title>
      <Typography component="p" variant="h4">
        20
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
    </React.Fragment>
  );
}

export default Pendents;



const useStyles = makeStyles({
  depositContext: {flex: 1, },
});