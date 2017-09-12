import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import UUID from 'uuid';
import { ACTIONS_CONST } from '../../constants';
import {
  ProviderActions,
  WSActions,
  ItemActions,
  AppActions,
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
function* getProviderKeys() {
  const state = yield select();
  const providers = state.find('providers');
  const currentProvider = providers.where({ selected: true }).get();

  const { provider } = yield Provider.providerGet(currentProvider.id);
  const keyIDs = yield Key.keyGetIDs(provider);

  if (keyIDs.length) {
    const getKeysArr = [];
    let index = 0;

    for (const keyID of keyIDs) {
      getKeysArr.push(Key.keyGet(provider, keyID));
    }

    const keysArr = yield getKeysArr;

    for (const item of keysArr) {
      const keyData = CertHelper.keyDataHandler({
        ...item,
        id: keyIDs[index],
      });
      index += 1;
      yield put(ItemActions.add(keyData, currentProvider.id));
    }
  }
}

/**
 * Get provider certificates
 */
function* getProviderCertificates() {
  const state = yield select();
  const providers = state.find('providers');
  const currentProvider = providers.where({ selected: true }).get();

  const { provider } = yield Provider.providerGet(currentProvider.id);
  const certIDs = yield Certificate.certificateGetIDs(provider);

  if (certIDs.length) {
    const getCertificatesArr = [];
    let index = 0;

    for (const certID of certIDs) {
      getCertificatesArr.push(Certificate.certificateGet(provider, certID));
    }

    const certificatesArr = yield getCertificatesArr;

    for (const item of certificatesArr) {
      const pem = yield Certificate.certificateExport(provider, item, 'pem');
      let certData = '';

      if (item.type === 'x509') {
        const raw = yield Certificate.certificateExport(provider, item, 'raw');
        const thumbprint = yield Certificate.certificateThumbprint(provider, raw);
        const certificateDetails = CertHelper.certRawToJson(raw);

        certData = CertHelper.certDataHandler({
          ...certificateDetails,
          id: certIDs[index],
          pem,
          thumbprint,
        });
      } else {
        certData = CertHelper.requestDataHandler({
          ...item,
          id: certIDs[index],
          pem,
        });
      }

      index += 1;
      yield put(ItemActions.add(certData, currentProvider.id));
    }
  }
}

/**
 * On 'listening' webcrypto-socket action
 * @returns {boolean}
 */
function* webcryptoOnListening() {
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
      name: prv.name,
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
}

/**
 * Login provider
 * @param {{
 *  id: string
 * }}
 */
function* providerLogin({ id }) {
  const crypto = yield Provider.cryptoGet(id);
  const isLogged = yield Provider.providerIsLogged(crypto);

  if (!isLogged) {
    const logged = yield Provider.providerLogin(crypto);
    yield put(ProviderActions.update({ logged }));
  } else {
    yield put(ProviderActions.update({ logged: true }));
  }
}

/**
 * Select provider
 * @param {{
 *  id: string
 * }}
 */
function* providerSelect({ id }) {
  const state = yield select();
  const providers = state.find('providers');
  const provider = providers.where({ id }).get();
  if (!provider.loaded) {
    yield [getProviderCertificates()];
    yield put(ItemActions.select());
    yield put(ProviderActions.update({ loaded: true }));
  }
  if (!provider.logged) {
    yield put(WSActions.login(provider.id));
  }
}

/**
 * Reload provider
 * @param {{
 *  id: string
 * }}
 */
function* providerReload({ id }) {
  yield put(AppActions.loaded(false));
  yield put(ProviderActions.update({ loaded: false, items: [] }));

  const crypto = yield Provider.cryptoReset(id);
  if (typeof crypto === 'undefined') {
    yield providerSelect({ id });
    yield put(AppActions.loaded(true));
  }
}

/**
 * Dowlnoad provider certificate/request/key
 * @param {{
 *  format: string
 * }}
 */
function* downloadItem({ format }) {
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
}

/**
 * Remove provider certificate/request/key
 */
function* removeItem() {
  const state = yield select();
  const selectedProvider = state.find('providers').where({ selected: true });
  const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

  if (crypto) {
    const selectedItem = selectedProvider.find('items').where({ selected: true }).get();
    let remove = '';

    if (selectedItem.type === 'key') {
      remove = yield Key.keyRemove(crypto, selectedItem._id);
    } else {
      remove = yield Certificate.certificateRemove(crypto, selectedItem._id);
    }
    if (remove) {
      yield put(ItemActions.remove(selectedItem.id));
      yield put(DialogActions.close());
    }
  }
}

function* importItem({ data }) {
  yield put(DialogActions.open('load'));

  const state = yield select();
  const selectedProvider = state.find('providers').where({ selected: true });
  const crypto = yield Provider.cryptoGet(selectedProvider.get().id);

  if (crypto) {
    const imported = yield Certificate.certificateImport(crypto, data);

    if (imported) {
      const item = yield Certificate.certificateGet(crypto, imported);
      const pem = yield Certificate.certificateExport(crypto, item, 'pem');
      const addedId = UUID();
      let certData = '';

      if (item.type === 'x509') {
        const raw = yield Certificate.certificateExport(crypto, item, 'raw');
        const thumbprint = yield Certificate.certificateThumbprint(crypto, raw);
        const certificateDetails = CertHelper.certRawToJson(raw);

        certData = CertHelper.certDataHandler({
          ...certificateDetails,
          id: imported,
          pem,
          thumbprint,
          addedId,
        });
      } else {
        certData = CertHelper.requestDataHandler({
          ...item,
          id: imported,
          pem,
          addedId,
        });
      }

      yield put(ItemActions.add(certData, selectedProvider.get().id));
      yield put(ModalActions.close());
      yield put(DialogActions.close());
      yield put(ItemActions.select(addedId));
    }
  }
}

function* createRequest({ data }) {
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
}

function* createSelfSignedCertificate({ data }) {
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
}

function* addedProvider({ data }) {
  EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_inserted', 3000);

  const state = yield select();
  const prv = data[0];
  const provider = yield Provider.providerGet(prv.id);

  yield put(ProviderActions.add({
    id: prv.id,
    name: prv.name,
    readOnly: prv.readOnly,
    index: state.get('providers').length,
    logged: provider.isLogged,
  }));
}

function* removedProvider({ data }) {
  EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_removed', 3000);
  yield webcryptoOnListening();
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_ON_LISTENING, webcryptoOnListening),
    takeEvery(ACTIONS_CONST.PROVIDER_SELECT, providerSelect),
    takeEvery(ACTIONS_CONST.PROVIDER_RELOAD, providerReload),
    takeEvery(ACTIONS_CONST.WS_LOGIN, providerLogin),
    takeEvery(ACTIONS_CONST.WS_DOWNLOAD_ITEM, downloadItem),
    takeEvery(ACTIONS_CONST.WS_REMOVE_ITEM, removeItem),
    takeEvery(ACTIONS_CONST.WS_IMPORT_ITEM, importItem),
    takeEvery(ACTIONS_CONST.WS_CREATE_REQUEST, createRequest),
    takeEvery(ACTIONS_CONST.WS_CREATE_SELF_SIGNED_CERTIFICATE, createSelfSignedCertificate),
    takeEvery(ACTIONS_CONST.WS_ADDED_PROVIDER, addedProvider),
    takeEvery(ACTIONS_CONST.WS_REMOVED_PROVIDER, removedProvider),
  ];
}
