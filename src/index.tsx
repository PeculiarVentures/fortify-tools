import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@peculiar/react-components';
import { App } from './app';

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root'),
);
