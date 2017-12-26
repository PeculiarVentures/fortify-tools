import { select, put, takeEvery, all } from 'redux-saga/effects';
import UUID from 'uuid';
import { Convert } from 'pvtsutils';
import { ACTIONS_CONST } from '../../constants';
import {
  ProviderActions,
  WSActions,
  ItemActions,
  AppActions,
  ErrorActions,
} from '../../actions/state';
import { DialogActions, ModalActions } from '../../actions/ui';
import { CertHelper, downloadCertFromURI } from '../../helpers';
import * as Key from './key';
import * as Provider from './provider';
import * as Certificate from './certificate';
import { RoutingController, EventChannel } from '../../controllers';

/**
 * Get provider keys
 */
// function* getProviderKeys() {
//   const state = yield select();
//   const providers = state.find('providers');
//   const currentProvider = providers.where({ selected: true }).get();
//
//   const { provider } = yield Provider.providerGet(currentProvider.id);
//   const keyIDs = yield Key.keyGetIDs(provider);
//
//   if (keyIDs.length) {
//     const getKeysArr = [];
//     let index = 0;
//
//     for (const keyID of keyIDs) {
//       getKeysArr.push(Key.keyGet(provider, keyID));
//     }
//
//     const keysArr = yield getKeysArr;
//
//     for (const item of keysArr) {
//       const keyData = CertHelper.keyDataHandler({
//         ...item,
//         id: keyIDs[index],
//       });
//       index += 1;
//       yield put(ItemActions.add(keyData, currentProvider.id));
//     }
//   }
// }

/**
 * Get provider certificates
 */
function* getProviderCertificates() {
  const state = yield select();
  const providers = state.find('providers');
  const currentProvider = providers.where({ selected: true }).get();

  const { provider } = yield Provider.providerGet(currentProvider.id);
  const keyIDs = yield Key.keyGetIDs(provider);
  const certIDs = yield Certificate.certificateGetIDs(provider);

  const certificatesArr = [];

  for (const certID of certIDs) {
    // Get certificates with private key only
    for (const keyID of keyIDs) {
      const keyParts = keyID.split('-');
      if (keyParts[0] === 'private' && keyParts[2] === certID.split('-')[2]) {
        const cert = yield Certificate.certificateGet(provider, certID);
        if (cert) {
          certificatesArr.push({
            id: certID,
            data: cert,
          });
        }
        break;
      }
    }
  }

  // sort certificates
  certificatesArr.sort((a, b) => {
    if (a.data.subjectName > b.data.subjectName) {
      return 1;
    } else if (a.data.subjectName < b.data.subjectName) {
      return -1;
    }
    return 0;
  });

  for (const item of certificatesArr) {
    const raw = yield Certificate.certificateExport(provider, item.data, 'raw');
    const base64 = Convert.ToBase64(raw);

    // Add \n after each 64 bytes
    let b64Formated = '';
    const b64Rows = [];
    let b64Row = '';
    for (let i = 0; i < base64.length; i++) {
      if (i && !(i % 64)) {
        b64Rows.push(b64Row);
        b64Row = '';
      }
      b64Row += base64.charAt(i);
    }
    if (b64Row && b64Row.length % 64) {
      b64Rows.push(b64Row);
    }
    b64Formated = b64Rows.join('\n');

    let certData = '';

    if (item.data.type === 'x509') {
      const pem = `-----BEGIN CERTIFICATE-----\n${b64Formated}\n-----END CERTIFICATE-----`;

      const thumbprint = yield Certificate.certificateThumbprint(provider, raw);
      const certificateDetails = CertHelper.certRawToJson(raw);

      certData = CertHelper.certDataHandler({
        ...certificateDetails,
        id: item.id,
        pem,
        thumbprint,
      });
    } else {
      const pem = `-----BEGIN CERTIFICATE REQUEST-----\n${b64Formated}\n-----END CERTIFICATE REQUEST-----`;

      certData = CertHelper.requestDataHandler({
        ...item.data,
        id: item.id,
        pem,
      });
    }

    yield put(ItemActions.add(certData, currentProvider.id));
  }
}

/**
 * Select provider
 * @param {{
 *  id: string
 * }}
 */
function* providerSelect({ id }) {
  try {
    const state = yield select();
    const providers = state.find('providers');
    const provider = providers.where({ id }).get();
    if (!provider.logged) {
      yield put(WSActions.login(provider.id));
      console.warn('yield put(WSActions.login(provider.id));');
    }
    if (!provider.loaded && provider.logged) {
      yield getProviderCertificates();
      yield put(ItemActions.select());
      yield put(ProviderActions.update({ loaded: true }));
    }
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

/**
 * On 'listening' webcrypto-socket action
 * @returns {boolean}
 */
function* webcryptoOnListening() {
  try {
    yield put(AppActions.setState({
      loaded: false,
      providers: [],
      status: 'online',
    }));

    const providers = yield Provider.providerGetList();
    let index = 0;
    let selected = false;
    const providersArray = [];

    const initState = RoutingController.parseInitState(
      window.location.pathname,
      window.location.search,
    );

    if (!providers.length) {
      yield put(DialogActions.open('empty_providers'));
      return false;
    }

    for (const prv of providers) {
      const provider = yield Provider.providerGet(prv.id);

      if (initState.params.provider === prv.id) {
        selected = prv.id;
      }

      providersArray.push({
        id: prv.id,
        name: prv.name || prv.reader || 'Token with empty name',
        readOnly: prv.readOnly,
        index,
        logged: provider.isLogged,
        selected: initState.params.provider === prv.id,
      });

      index += 1;
    }

    if (!selected) {
      selected = providersArray[0].id;
      providersArray[0].selected = true;
    }

    yield put(AppActions.setState({
      providers: providersArray,
    }));

    if (RoutingController.initialState.create) {
      yield put(AppActions.create(true));
    }

    yield providerSelect({ id: selected });
    yield put(AppActions.loaded(true));

    return true;
  } catch (error) {
    yield put(ErrorActions.error(error));
    return false;
  }
}

/**
 * Login provider
 * @param {{
 *  id: string
 * }}
 */
function* providerLogin({ id }) {
  console.warn('providerLogin');
  try {
    const crypto = yield Provider.cryptoGet(id);
    const isLogged = yield Provider.providerIsLogged(crypto);

    if (!isLogged) {
      const logged = yield Provider.providerLogin(crypto);
      yield put(ProviderActions.update({ logged }));

      if (logged) {
        yield getProviderCertificates();
        yield put(ItemActions.select());
        yield put(ProviderActions.update({ loaded: true }));
      }
      console.warn('put ProviderActions.update({ logged })');
    } else {
      yield getProviderCertificates();
      yield put(ItemActions.select());
      yield put(ProviderActions.update({ logged: true, loaded: true }));
    }
  } catch (error) {
    yield put(ErrorActions.error(error, 'unauthorize_pin'));
  }
}

/**
 * Reload provider
 * @param {{
 *  id: string
 * }}
 */
function* providerReload({ id }) {
  try {
    yield put(AppActions.loaded(false));
    yield put(ProviderActions.update({ loaded: false, items: [] }));

    const crypto = yield Provider.cryptoGet(id);
    yield Provider.cryptoReset(crypto);
    yield providerSelect({ id });
    yield put(AppActions.loaded(true));
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

/**
 * Dowlnoad provider certificate/request/key
 * @param {{
 *  format: string
 * }}
 */
function* downloadItem({ format }) {
  try {
    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true });
    const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

    if (crypto) {
      const selectedItem = selectedProvider.find('items').where({ selected: true }).get();
      const item = yield Certificate.certificateGet(crypto, selectedItem._id);
      const exported = yield Certificate.certificateExport(crypto, item, format);

      if (exported && typeof exported === 'string') {
        downloadCertFromURI(selectedItem.name, exported, selectedItem.type);
      } else if (exported) {
        downloadCertFromURI(selectedItem.name, [exported], selectedItem.type, true);
      }
    }
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

/**
 * Remove provider certificate/request/key
 */
function* removeItem() {
  try {
    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true });
    const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

    const selectedItem = selectedProvider.find('items').where({ selected: true }).get();
    console.log(selectedItem);

    if (selectedItem.type === 'key') {
      yield Key.keyRemove(crypto, selectedItem._id);
    } else {
      yield Certificate.certificateRemove(crypto, selectedItem._id);
    }
    yield put(ItemActions.remove(selectedItem.id));
    yield put(DialogActions.close());
  } catch (error) {
    yield put(ErrorActions.error(error, 'remove_item_error'));
  }
}

function* importItem({ data }) {
  try {
    const preparedCert = CertHelper.prepareCertToImport(data);

    yield put(DialogActions.open('load'));

    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true });
    const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

    const cert = yield Certificate.certificateImport(crypto, preparedCert);
    const hasPrivateKey = yield Certificate.certificateHasPrivateKey(crypto, cert);
    if (!hasPrivateKey) {
      throw new Error("Cannot import certificate item, cause it doesn't have private key in storage");
    }
    const certID = yield Certificate.certificateSet(crypto, cert);

    // Look for the existing requests and remove them
    try {
      const certIdParts = certID.split('-');
      const certIDs = yield Certificate.certificateGetIDs(crypto);
      for (const id of certIDs) {
        const idParts = id.split('-');
        if (idParts[0] === 'request' && idParts[2] === certIdParts[2]) {
          yield Certificate.certificateRemove(crypto, id);
          yield put(ItemActions.remove(id));
        }
      }
    } catch (error) {
      console.error('Cannot remove request for imported certificate');
      console.error(error);
    }

    if (certID) {
      const item = yield Certificate.certificateGet(crypto, certID);
      const pem = yield Certificate.certificateExport(crypto, item, 'pem');
      const addedId = UUID();
      let certData = '';

      if (item.type === 'x509') {
        const raw = yield Certificate.certificateExport(crypto, item, 'raw');
        const thumbprint = yield Certificate.certificateThumbprint(crypto, raw);
        const certificateDetails = CertHelper.certRawToJson(raw);

        certData = CertHelper.certDataHandler({
          ...certificateDetails,
          id: certID,
          pem,
          thumbprint,
          addedId,
        });
      } else {
        certData = CertHelper.requestDataHandler({
          ...item,
          id: certID,
          pem,
          addedId,
        });
      }

      yield put(ItemActions.add(certData, selectedProvider.get().id));
      yield put(ModalActions.close());
      yield put(DialogActions.close());
      yield put(ItemActions.select(addedId));
    }
  } catch (error) {
    yield put(ErrorActions.error(error, 'import_item'));
  }
}

function* createRequest({ data }) {
  try {
    yield put(DialogActions.open('load'));

    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true });
    const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

    if (crypto) {
      const created = yield Certificate.certificateCreate(crypto, data);

      if (created) {
        const item = yield Certificate.certificateGet(crypto, created);
        const pem = yield Certificate.certificateExport(crypto, item, 'pem');
        const addedId = UUID();

        const certData = CertHelper.requestDataHandler({
          ...item,
          id: created,
          pem,
          addedId,
        });

        yield put(ItemActions.add(certData, selectedProvider.get().id));
        yield put(AppActions.create(false));
        yield put(DialogActions.close());
        yield put(ItemActions.select(addedId));
      }
    }
  } catch (error) {
    yield put(ErrorActions.error(error, 'request_create'));
  }
}

function* createSelfSignedCertificate({ data }) {
  try {
    yield put(DialogActions.open('load'));

    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true });
    const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

    if (crypto) {
      const created = yield Certificate.CMSCreate(crypto, data);

      if (created) {
        const item = yield Certificate.certificateGet(crypto, created);
        const pem = yield Certificate.certificateExport(crypto, item, 'pem');
        const addedId = UUID();
        let certData = '';

        if (item.type === 'x509') {
          const raw = yield Certificate.certificateExport(crypto, item, 'raw');
          const thumbprint = yield Certificate.certificateThumbprint(crypto, raw);
          const certificateDetails = CertHelper.certRawToJson(raw);

          certData = CertHelper.certDataHandler({
            ...certificateDetails,
            id: created,
            pem,
            thumbprint,
            addedId,
          });
        } else {
          certData = CertHelper.requestDataHandler({
            ...item,
            id: created,
            pem,
            addedId,
          });
        }

        yield put(ItemActions.add(certData, selectedProvider.get().id));
        yield put(AppActions.create(false));
        yield put(DialogActions.close());
        yield put(ItemActions.select(addedId));
      }
    }
  } catch (error) {
    yield put(ErrorActions.error(error, 'request_create'));
  }
}

function* addedProvider({ data }) {
  try {
    EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_inserted', 3e3);

    const state = yield select();

    for (const prv of data) {
      const provider = yield Provider.providerGet(prv.id);

      yield put(ProviderActions.add({
        id: prv.id,
        name: prv.name,
        readOnly: prv.readOnly,
        index: state.get('providers').length,
        logged: provider.isLogged,
      }));

      if (state.get('dialog') === 'empty_providers') {
        yield put(DialogActions.close());
      }
    }
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

function* removedProvider() {
  try {
    EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_removed', 3000);
    yield webcryptoOnListening();
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

export default function* () {
  yield all([
    yield takeEvery(ACTIONS_CONST.WS_ON_LISTENING, webcryptoOnListening),
    yield takeEvery(ACTIONS_CONST.PROVIDER_SELECT, providerSelect),
    yield takeEvery(ACTIONS_CONST.PROVIDER_RELOAD, providerReload),
    yield takeEvery(ACTIONS_CONST.WS_LOGIN, providerLogin),
    yield takeEvery(ACTIONS_CONST.WS_DOWNLOAD_ITEM, downloadItem),
    yield takeEvery(ACTIONS_CONST.WS_REMOVE_ITEM, removeItem),
    yield takeEvery(ACTIONS_CONST.WS_IMPORT_ITEM, importItem),
    yield takeEvery(ACTIONS_CONST.WS_CREATE_REQUEST, createRequest),
    yield takeEvery(ACTIONS_CONST.WS_CREATE_SELF_SIGNED_CERTIFICATE, createSelfSignedCertificate),
    yield takeEvery(ACTIONS_CONST.WS_ADDED_PROVIDER, addedProvider),
    yield takeEvery(ACTIONS_CONST.WS_REMOVED_PROVIDER, removedProvider),
  ]);
}
