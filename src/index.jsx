/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { objectOmitPluck } from './helpers';
import Routing from './routing';
import Store from './store';
import { WSController } from './controllers/webcrypto_socket';

if (process.env && process.env.NODE_ENV === 'development') {
  window.Store = Store;
}
WSController.connect();

ReactDOM.render(<Routing />, document.getElementById('root'));
