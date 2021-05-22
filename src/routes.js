import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from "./services/auth";

import Home from "./pages/Home";
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
import DetailProduto from "./pages/client/Menu/DetailProduto";
import Cart from "./pages/client/Cart";
import Pedidos from "./pages/client/Pedidos";


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      {/* ROTAS GERENCIADOR */}
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/categoria" component={Categoria} />
      <Route exact path="/categoria/new" component={AddCategoria} />
      <Route exact path="/categoria/edit" component={EditCategoria} />
      <Route exact path="/produto" component={Produto} />
      <Route exact path="/produto/new" component={AddProduto} />
      <Route exact path="/produto/edit" component={EditProduto} />
      <Route exact path="/pedidos/admin" component={PedidosGer} />
      <Route exact path="/relatorios" component={Relatorios} />
      <Route exact path="/profile" component={Profile} />
      {/* ROTAS CLIENTE */}
      <Route exact path="/menu" component={Menu} />
      <Route exact path="/menu/detail" component={DetailProduto} />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="/pedidos" component={Pedidos} />

      <PrivateRoute exact path="/app" component={() => <h1>App</h1>} />
      <Route path="*" component={() => <h1>Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;