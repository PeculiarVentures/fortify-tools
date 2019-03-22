/* eslint no-undef: 0 */
import 'webcrypto-liner';
import * as wsClient from '@webcrypto-local/client/build/index.js';

import Store from '../store';
import { WSActions, ErrorActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import { EventChannel } from '../controllers';

class WS {
  interval = null;

  async init() {
    const storage = await wsClient.BrowserStorage.create();

    this.ws = new wsClient.SocketProvider({
      storage,
    });
  }

  async connect() {
    clearTimeout(this.interval);

    if (!this.ws) {
      await this.init();
    }

    this.ws.removeAllListeners();

    this.ws.connect(process.env.SERVER_URL)
      .on('error', (error) => {
        clearTimeout(this.interval);
        Store.dispatch(ErrorActions.error(error));
        console.log('WebcryptoSocket connected error: ', error);
      })
      .on('listening', () => {
        clearTimeout(this.interval);
        Store.dispatch(WSActions.status('online'));

        this.isLogged();
      })
      .on('close', () => {
        Store.dispatch(ErrorActions.error({
          message: 'offline',
        }));
        this.checkConnect();
      })
      .on('token', (info) => {
        if (info.added.length) {
          Store.dispatch(WSActions.addedProvider(info.added));
        }
        if (info.removed.length) {
          Store.dispatch(WSActions.removedProvider(info.removed));
        }
        if (info.error) {
          console.log('TOKEN:', info.error);
        }
        clearTimeout(this.interval);
      });
  }

  checkConnect() {
    this.interval = setTimeout(() => {
      this.connect();
    }, 4e3);
  }

  isLogged() {
    this.ws.isLoggedIn()
      .then((ok) => {
        if (!ok) {
          this.ws.challenge()
            .then((pin) => {
              EventChannel.emit('DIALOG:SET_MESSAGE', pin);
              Store.dispatch(DialogActions.open('fortify_authorization'));
            });
          return this.ws.login();
        }
        return true;
      })
      .then(() => {
        Store.dispatch(DialogActions.close());
        Store.dispatch(WSActions.onListening());
      })
      .catch((error) => {
        Store.dispatch(ErrorActions.error(error));
      });
  }
}

const WSController = new WS();

export default WSController;

if (process.env && process.env.NODE_ENV === 'development') {
  window.WSController = WSController;
}
