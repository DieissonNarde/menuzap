import React from "react";
import ButtonMaterial from "@material-ui/core/Button";

const Button = ({ children }) => {
  return (
    <ButtonMaterial size="large" variant="contained" color="primary">
      {children}
    </ButtonMaterial>
  );
};

export default Button;
