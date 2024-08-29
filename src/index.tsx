import ReactDOM from "react-dom/client";
import { AppProviders } from "./components/app-providers";
import { App } from "./app";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
