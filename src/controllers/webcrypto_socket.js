/* eslint no-undef: 0 */
import { SERVER_URL } from '../../scripts/config';
import Store from '../store';
import { WSActions, ErrorActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import { EventChannel } from '../controllers';

export const ws = new WebcryptoSocket.SocketProvider();
if (process.env && process.env.NODE_ENV === 'development') {
  window.ws = ws;
}

export const WSController = {
  interval: null,
  connect: function connect() {
    clearTimeout(this.interval);
    ws.removeAllListeners();

    ws.connect(SERVER_URL)
      .on('error', (error) => {
        clearTimeout(this.interval);
        Store.dispatch(ErrorActions.error(error));
        console.log('WebcryptoSocket connected error: ', error.message);
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
  },

  checkConnect: function checkConnect() {
    this.interval = setTimeout(() => {
      this.connect();
    }, 4000);
  },

  isLogged: function isLogged() {
    ws.isLoggedIn()
      .then((ok) => {
        if (!ok) {
          ws.challenge()
            .then((pin) => {
              EventChannel.emit('DIALOG:SET_MESSAGE', pin);
              Store.dispatch(DialogActions.open('fortify_authorization'));
            });
          return ws.login();
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
  },
};
