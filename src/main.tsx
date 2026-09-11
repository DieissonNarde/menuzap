import { createRoot } from "react-dom/client";

import App from "./App";
import { initializeParse } from "./services/parse/client";

initializeParse();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Elemento raiz da aplicação não encontrado.");
}

createRoot(container).render(<App />);
