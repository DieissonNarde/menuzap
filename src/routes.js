import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
// GERENCIADOR
import Dashboard from "./pages/admin/Dashboard";
import Categoria from "./pages/admin/Categoria";
import AddCategoria from "./pages/admin/Categoria/AddCategoria";
import EditCategoria from "./pages/admin/Categoria/EditCategoria";
import Produto from "./pages/admin/Produto";
import AddProduto from "./pages/admin/Produto/AddProduto";
import EditProduto from "./pages/admin/Produto/EditProduto";
import PedidosGer from "./pages/admin/PedidosGer";
import Relatorios from "./pages/admin/Relatorios";
import Profile from "./pages/admin/Profile";
// CLIENTE
import Menu from "./pages/client/Menu";
import DetailEmpresa from "./pages/client/Menu/DetailEmpresa";
import DetailProduto from "./pages/client/Menu/DetailProduto";
import Cart from "./pages/client/Cart";
import NewPedido from "./pages/client/Cart/NewPedido";
import Pedidos from "./pages/client/Pedidos";

import Parse from 'parse';
import * as Env from "./services/environments";
import PrivateRoute from "./services/auth";
import CartState from './context/cart/CartState';

Parse.initialize(Env.APPLICATION_ID, Env.JAVASCRIPT_KEY);
Parse.serverURL = Env.SERVER_URL;


const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/register" component={Register} />
      {/* ROTAS GERENCIADOR */}
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/categoria" component={Categoria} />
      <PrivateRoute exact path="/categoria/new" component={AddCategoria} />
      <PrivateRoute exact path="/categoria/edit/:idCategoria" component={EditCategoria} />
      <PrivateRoute exact path="/categoria/:idCategoria/produto/" component={Produto} />
      <PrivateRoute exact path="/categoria/:idCategoria/produto/new" component={AddProduto} />
      <PrivateRoute exact path="/categoria/:idCategoria/produto/edit/:idProduto" component={EditProduto} />
      <PrivateRoute exact path="/pedidos/admin" component={PedidosGer} />
      <PrivateRoute exact path="/relatorios" component={Relatorios} />
      <PrivateRoute exact path="/profile" component={Profile} />
      {/* ROTAS CLIENTE */}
      <CartState>
        <Route exact path="/:subdominio/menu" component={Menu} />
        <Route exact path="/:subdominio/menu/item/:id" component={DetailProduto} />
        <Route exact path="/:subdominio/cart" component={Cart} />
        <Route exact path="/:subdominio/newpedido" component={NewPedido} />
      </CartState>
      <Route exact path="/:subdominio/empresa" component={DetailEmpresa} />
      <Route exact path="/:subdominio/pedidos" component={Pedidos} />

      <PrivateRoute path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;