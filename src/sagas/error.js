import { put, all, takeEvery } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { DialogActions } from '../actions/ui';
import { WSActions } from '../actions/state';
import { WSController } from '../controllers/webcrypto_socket';
import { EventChannel } from '../controllers';

// CODES FOR ERRORS
// const CODES = {
//   0: 'UNKNOWN',
//   1: 'METHOD_NOT_IMPLEMENTED',
//   2: 'CASE_ERROR',
//   100: 'RATCHET_COMMON',
//   101: 'RATCHET_KEY_NOT_APPROVED',
//   160: 'CKR_PIN_INCORRECT',
//   200: 'ACTION_COMMON',
//   201: 'ACTION_NOT_IMPLEMENTED',
//   202: 'ACTION_NOT_SUPPORTED',
//   300: 'CARD_CONFIG_COMMON',
//   350: 'MEMORY_STORAGE_COMMON',
//   351: 'MEMORY_STORAGE_OUT_OF_INDEX',
//   400: 'PROVIDER_COMMON',
//   401: 'PROVIDER_INIT',
//   402: 'PROVIDER_CRYPTO_NOT_FOUND',
//   403: 'PROVIDER_CRYPTO_WRONG',
//   404: 'PROVIDER_NOT_FOUND',
//   405: 'PROVIDER_WRONG_LIBRARY',
//   500: 'TOKEN_COMMON',
//   501: 'TOKEN_REMOVE_TOKEN_READING',
//   502: 'TOKEN_REMOVE_NO_SLOTS_FOUND',
//   600: 'SERVER_COMMON',
//   601: 'SERVER_WRONG_MESSAGE',
//   602: 'SERVER_NOT_LOGGED_IN',
//   10001: 'EMPTY_PIN',
//   90001: 'OFFLINE',
//   90002: 'NOT_SUPPORTED_LOCALHOST',
//   90003: 'REQUEST_CREATE_ERROR',
//   90004: 'IMPORT_ITEM_ERROR',
//   90005: 'REMOVE_ITEM_ERROR',
// };

function* errorHandler(payload) {
  const { data, action } = payload;

  if (!data) {
    return console.error(data);
  }

  const { message = '', stack } = data;
  let code = data.code;

  console.error('ERROR MESSAGE:', message);
  console.log('CODE:', data.code);

  if (message === 'NetworkError when attempting to fetch resource.') {
    code = 90002;
  } else if (action === 'request_create') {
    code = 90003;
  } else if (action === 'import_item') {
    code = 90004;
  } else if (/XMLHttpRequest.xmlHttp/.test(stack) || message === 'offline' || message === 'Failed to fetch') {
    code = 90001;
  }

  switch (code) {
    case 101: {
      yield put(DialogActions.open('unauthorize_pin'));
      break;
    }

    case 160: {
      yield put(DialogActions.open('incorrect_pin'));
      break;
    }

    case 10001: {
      yield put(DialogActions.open('empty_pin'));
      break;
    }

    case 90001: {
      yield put(DialogActions.open('server_offline'));
      WSController.checkConnect();
      yield put(WSActions.status('offline'));
      break;
    }

    case 90002:
      yield put(DialogActions.open('not_supported_localhost'));
      break;

    case 90003: {
      yield put(DialogActions.open('request_create_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    case 90004: {
      yield put(DialogActions.open('certificate_import_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    case 90005: {
      yield put(DialogActions.open('remove_item_error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      break;
    }

    default:
      yield put(DialogActions.open('error'));
      EventChannel.emit('DIALOG:SET_MESSAGE', message);
      return true;
  }

  return true;
}

export default function* () {
  yield all([
    yield takeEvery(ACTIONS_CONST.ERROR, errorHandler),
  ]);
}
