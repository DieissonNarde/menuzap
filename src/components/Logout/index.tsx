import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../services/parse/auth.service";
import { getErrorMessage } from "../../util/errors";

const Logout = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  async function handleLogout(): Promise<void> {
    setFeedback("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setFeedback(`Não foi possível sair: ${getErrorMessage(error)}`);
      if (import.meta.env.DEV) console.error("Erro no logout", error);
    }
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => void handleLogout()}>
        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
        <ListItemText sx={{ color: "red" }} primary="Sair" secondary={feedback} />
      </ListItemButton>
    </ListItem>
  );
};

export default Logout;
