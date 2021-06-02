import React from 'react';
import { Link } from 'react-router-dom'

import Divider from "@material-ui/core/Divider";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import CropFreeIcon from '@material-ui/icons/CropFree';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Logout from "../Logout";


export const menuAdmin = (
  <div>
    <Link to="/dashboard">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link to="/categoria">
      <ListItem button>
        <ListItemIcon>
          <RestaurantMenuIcon />
        </ListItemIcon>
        <ListItemText primary="Cardápio" />
      </ListItem>
    </Link>
    <Link to="/pedidos/admin">
      <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
    </Link>
    <Link to="/qrcode">
      <ListItem button>
        <ListItemIcon>
          <CropFreeIcon />
        </ListItemIcon>
        <ListItemText primary="Gerar QR Code" />
      </ListItem>
    </Link>
    <Link to="/relatorios">
      <ListItem button>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="Relatórios" />
      </ListItem>
    </Link>
    <Link to="/profile">
      <ListItem button>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Minha Conta" />
      </ListItem>
    </Link>
    <Logout />
  </div>
);

export const menuClient = (
  <div>
    <Link to="/menu">
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Menu" />
      </ListItem>
    </Link>
    <Divider />
    <Link to="/cart">
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Carrinho" />
      </ListItem>
    </Link>
    <Divider />
    <Link to="/pedidos">
      <ListItem button>
        <ListItemIcon>
          <ListIcon />
        </ListItemIcon>
        <ListItemText primary="Pedidos" />
      </ListItem>
    </Link>
    <Divider />
  </div>
);