import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://upplaycompnay.com.br/">
        upPlay Company
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const FooterGer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">Menu Play</Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}

export default FooterGer;



const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', flexDirection: 'column', },
  footer: {padding: theme.spacing(2, 0), marginTop: 'auto', textAlign: 'center', },
}));