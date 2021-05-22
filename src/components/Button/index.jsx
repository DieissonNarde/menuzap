import React from 'react';
import ButtonMaterial from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';



const Button = ({ children }) => {
    return (
        <ButtonMaterial variant="contained" color="primary">
            {children}
        </ButtonMaterial>
    );
}

export default Button;


// const useStyles = makeStyles((theme) => ({
//     heroContent: {
//       backgroundColor: theme.palette.background.paper,
//       padding: theme.spacing(8, 0, 6),
//     },
//     heroButtons: {
//       marginTop: theme.spacing(4),
//     },

//   }));