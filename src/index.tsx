// tsyringe in @peculiar/x509 needs a Reflect polyfill before x509 loads, and app modules import
// x509 before @peculiar/fortify-client-core (which loads the same polyfill). Keep this import first.
import '@abraham/reflection';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { AppProviders } from './components/app-providers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProviders>
    <App />
  </AppProviders>,
);
