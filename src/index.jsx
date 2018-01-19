import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './helpers/object_omit_pluck';
import Routing from './routing';
import Store from './store';
import { WSActions } from './actions/state';

if (process.env && process.env.NODE_ENV === 'development') {
  window.Store = Store;
}

Store.dispatch(WSActions.handleAction('need_online'));

ReactDOM.render(
  <Provider store={Store}>
    <Routing />
  </Provider>,
  document.getElementById('root'),
);
