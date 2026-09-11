import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type PropsWithChildren, useState } from "react";

import LogoName from "../../assets/images/logo-nome.png";
import { getCurrentUser } from "../../services/parse/auth.service";
import { menuAdmin } from "../MenuList";

const drawerWidth = 240;

const Menu = ({ children }: PropsWithChildren) => {
  const [username] = useState(() => getCurrentUser()?.username ?? "");
  const [open, setOpen] = useState(true);

  return (
    <>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={(theme) => ({
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        })}
      >
        <Toolbar sx={{ pr: 3 }}>
          <IconButton edge="start" color="inherit" aria-label="Abrir menu" onClick={() => setOpen(true)} sx={{ mr: 4.5, ...(open && { display: "none" }) }}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {children}
          </Typography>
          {username}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        slotProps={{
          paper: {
            sx: (theme) => ({
              position: "relative",
              whiteSpace: "nowrap",
              width: open ? drawerWidth : theme.spacing(7),
              overflowX: open ? "visible" : "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: open
                  ? theme.transitions.duration.enteringScreen
                  : theme.transitions.duration.leavingScreen,
              }),
              ...(!open && {
                [theme.breakpoints.up("sm")]: { width: theme.spacing(9) },
              }),
            }),
          },
        }}
      >
        <Box sx={(theme) => ({ display: "flex", alignItems: "center", justifyContent: "flex-end", px: 1, ...theme.mixins.toolbar })}>
          <Box component="img" src={LogoName} alt="Menu Zap" sx={{ width: "72%", mr: "auto" }} />
          <IconButton onClick={() => setOpen(false)} aria-label="Fechar menu">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>{menuAdmin}</List>
      </Drawer>
    </>
  );
};

export default Menu;
