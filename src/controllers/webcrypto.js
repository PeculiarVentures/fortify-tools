// Copyright (c) 2017, Peculiar Ventures, All rights reserved.

/* eslint no-undef: 0 */
import { WEBCRYPTO_URL } from '../../scripts/config';

// for debug WebcryptoSocket logs
// window.PV_WEBCRYPTO_SOCKET_LOG = true;

export const ws = new WebcryptoSocket.SocketProvider();

export const WSController = {
  /**
   * Connect to WS server
   */
  connect: function connect() {
    return ws.connect(WEBCRYPTO_URL);
  },

  /**
   * Get connection approve status
   */
  isLogged: function isLogged() {
    return ws.isLoggedIn();
  },

  /**
   * Get fortify server status
   * @returns {Promise<Response>}
   */
  serverStatus: function serverStatus() {
    return fetch(`https://${WEBCRYPTO_URL}/.well-known/webcrypto-socket`, {
      method: 'GET',
    });
  },

  /**
   * Get socket connection info
   */
  connectionInfo: function connectionStatus() {
    return ws.info();
  },

  /**
   * Close socket connection, remove listeners
   */
  close: function close() {
    ws.removeAllListeners();
    try {
      ws.close();
    } catch (err) {
      console.log(err);
    }
  },
};

if (process.env && process.env.NODE_ENV === 'development') {
  window.ws = ws;
  window.WSController = WSController;
}

