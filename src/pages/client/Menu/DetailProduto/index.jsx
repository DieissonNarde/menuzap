import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";

import MenuClient from '../../../../components/MenuClient';
import Button from '../../../../components/Button';
import Footer from "../../../../components/FooterGer";

const DetailProduto = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MenuClient>Produto</MenuClient>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                      <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random"
                        title="Image title"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CardContent className={classes.cardContent}>
                        <Typography
                          className={classes.title}
                          gutterBottom
                          variant="h3"
                          component="h3"
                        >
                          Produto
                        </Typography>
                        <Typography>
                          This is a media card. You can use this section to
                          describe the content.
                        </Typography>
                      </CardContent>
                      <h4 className={classes.price}>R$ 53,99</h4>
                      <Grid container justify="flex-end">
                        <Button>Adicionar ao Carrinho</Button>
                      </Grid>
                      
                    </Grid>
                    
                    <Grid className={classes.acrecimos} item xs={12} sm={6}>
                      <Divider />
                      <Typography
                        className={classes.title}
                        gutterBottom
                        variant="h5"
                        component="h4"
                      >
                        Acrécimos
                      </Typography>
                      <Paper >
                        <Grid container>
                          <Grid item xs={6} sm={6}>
                            <Typography
                              className={classes.title}
                              gutterBottom
                              variant="h6"
                              component="h4"
                            >
                              Salada
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={6}>
                            <Typography
                              className={classes.priceAcr}
                              gutterBottom
                              variant="h6"
                              component="h4"
                            >
                              + R$ 3,20
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                   
                  
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Box pt={4}>
          <Footer />
        </Box>
      </main>
    </div>
  );
};

export default DetailProduto;


const useStyles = makeStyles((theme) => ({
  root: {display: 'flex', },
  title: {flexGrow: 1, },
  appBarSpacer: theme.mixins.toolbar,
  content: {flexGrow: 1, height: '100vh', overflow: 'auto', },
  container: {paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4), },
  paper: {padding: 28, display: 'flex', overflow: 'auto', flexDirection: 'column', },
  cardGrid: {paddingTop: theme.spacing(8), paddingBottom: theme.spacing(8), },
  card: {height: '100%', display: 'flex', flexDirection: 'column', },
  cardMedia: {paddingTop: '56.25%', borderRadius: 20, }, // 16:9
  cardContent: {flexGrow: 1, },
  title: {display: 'flex', justifyContent: 'space-between', },
  price: {fontWeight: 'bold', color: 'green', fontSize: 22, marginLeft: 15, },
  priceAcr: {fontWeight: 'bold', color: 'green', fontSize: 18, textAlign: 'end', },
  acrecimos: {marginTop: 20, },
}));