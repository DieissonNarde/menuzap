import React from 'react';
import { useHistory } from "react-router-dom";
import Parse from "parse";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const Logout = () => {
  const history = useHistory();

  async function handleLogout() {
    await Parse.User.logOut()
      .then(() => {
        history.push('/login');
      })
      .catch((error) => {
        // Show the error message somewhere and let the user try again.
        alert(
          "Infelizmente houve algum erro ao tentar efetuar o Logout. Tente novamente! Erro: " +
            error.code
        );
        console.log("Error Logout: " + error.code + " " + error.message);
      });
  }

  return (
    <ListItem button onClick={handleLogout}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText color="secondary" primary="Sair" />
    </ListItem>
  );
};

export default Logout;


