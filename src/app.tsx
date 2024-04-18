import "./global.scss";
import "./i18n";
import { Certificates } from "./components/certificates";
import { AppProviders } from "./components/app-providers";

export function App() {
  return (
    <AppProviders>
      <Certificates />
    </AppProviders>
  );
}
