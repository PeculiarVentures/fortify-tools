import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@peculiar/react-components";
import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
