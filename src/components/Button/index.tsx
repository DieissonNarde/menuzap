import ButtonMaterial, { type ButtonProps } from "@mui/material/Button";

const Button = (props: ButtonProps) => (
  <ButtonMaterial size="large" variant="contained" color="primary" {...props} />
);

export default Button;
