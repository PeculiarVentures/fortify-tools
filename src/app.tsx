import { Certificates } from "./components/certificates";
import { Providers } from "./components/providers/Providers";

export function App() {
  return (
    <Providers>
      <Certificates />
    </Providers>
  );
}
