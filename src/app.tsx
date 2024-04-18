import "./i18n";
import { Certificates } from "./components/certificates";
import { Providers } from "./components/providers";

export function App() {
  return (
    <Providers>
      <Certificates />
    </Providers>
  );
}
