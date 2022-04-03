import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@peculiar/react-components';
import { App } from './app';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
