import React, { useState } from 'react';
import Parse from "parse";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Header from '../../components/Header';
import Footer from '../../components/FooterGer';

import UserForm from './UserForm';
import PaymentForm from './PaymentForm';
import Order from './Order';


const steps = ['Dados de Registro', 'Dados de Pagamento', 'Resumo da sua Assinatura'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <UserForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Order />;
    default:
      throw new Error('Unknown step');
  }
}

const Checkout = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  // const dataTeste = dataUser();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  async function handleSignUp(ev) {
    ev.preventDefault();

    let data = "teste";
    let user = new Parse.User();

    await user.signUp(data)
      .then(async (user) => {
        console.log('User: ', user);
        const Empresa = Parse.Object.extend('Empresa');
        const newEmpresa = new Empresa();

        newEmpresa.set('id_user', user.id);
        await newEmpresa.save().then(
          (result) => {
            console.log('Empresa created', result);
            handleNext();
          },
          (error) => {
            console.error('Error while creating Empresa: ', error);
          }
        );
      }).catch((err) => {
        // Show the error message somewhere and let the user try again.
        console.log("Error: " + err.code + " " + err.message);
      });
  }

  return (
    <>
      <CssBaseline />
      <Header />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Obrigado pela sua Assinatura.
                </Typography>
                <Typography variant="subtitle1">
                  Enviamos por e-mail um link de confirmação do seu cadastro e
                  aproveite o acesso ilimitado por 15 dias grátis da sua assinatura.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Voltar
                    </Button>
                  )}
                  {activeStep === steps.length - 1 
                    ?
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={handleSignUp}
                      className={classes.button}
                    >
                      Confirmar
                    </Button> 
                    :
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Avançar
                    </Button>
                  }
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>

        <Footer />
      </main>
    </>
  );
}

export default Checkout;


const useStyles = makeStyles((theme) => ({
  layout: {width: 'auto', marginLeft: theme.spacing(2), marginRight: theme.spacing(2), [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
    width: 600, marginLeft: 'auto', marginRight: 'auto', }, },
  paper: {marginTop: theme.spacing(3), marginBottom: theme.spacing(3), padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {marginTop: theme.spacing(6), marginBottom: theme.spacing(6), padding: theme.spacing(3), }, },
  stepper: {padding: theme.spacing(3, 0, 5), },
  buttons: {display: 'flex', justifyContent: 'flex-end', },
  button: {marginTop: theme.spacing(3), marginLeft: theme.spacing(1), },
}));