import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ListIcon from "@mui/icons-material/List";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import Logout from "../Logout";

interface MenuLinkProps {
  to: string;
  label: string;
  icon: ReactNode;
}

const MenuLink = ({ to, label, icon }: MenuLinkProps) => (
  <ListItem disablePadding>
    <ListItemButton component={Link} to={to}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  </ListItem>
);

const AdminNavigation = () => (
  <>
    <MenuLink to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
    <MenuLink to="/categoria" label="Cardápio" icon={<RestaurantMenuIcon />} />
    <MenuLink to="/pedidos/admin" label="Pedidos" icon={<ListIcon />} />
    <MenuLink to="/relatorios" label="Relatórios" icon={<ListAltIcon />} />
    <MenuLink to="/profile" label="Minha Conta" icon={<AccountCircleIcon />} />
    <Logout />
  </>
);

export const menuAdmin = <AdminNavigation />;

export const MenuClient = () => {
  const { subdominio } = useParams<{ subdominio: string }>();
  const basePath = subdominio ? `/${subdominio}` : "";

  return (
    <>
      <MenuLink to={`${basePath}/menu`} label="Menu" icon={<HomeIcon />} />
      <Divider />
      <MenuLink to={`${basePath}/cart`} label="Carrinho" icon={<ShoppingCartIcon />} />
      <Divider />
    </>
  );
};
