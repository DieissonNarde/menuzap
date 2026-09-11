import Typography from "@mui/material/Typography";
import type { PropsWithChildren } from "react";

const Title = ({ children }: PropsWithChildren) => (
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
    {children}
  </Typography>
);

export default Title;
