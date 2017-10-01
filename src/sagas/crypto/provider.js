import { put } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { ErrorActions } from '../../actions/state';

/**
 * Get providers list
 * @returns {Array}
 */
export function* providerGetList() {
  const info = yield ws.info();
  return info.providers;
}

/**
 * Check provider logged state
 * @param {object} crypto
 * @returns {boolean}
 */
export function* providerIsLogged(crypto) {
  return yield crypto.isLoggedIn();
}

/**
 * Login provider
 * @param {object} crypto
 * @returns {boolean}
 */
export function* providerLogin(crypto) {
  try {
    yield crypto.login();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Get provider crypto
 * @param {string} id
 * @returns {Promise}
 */
export function* cryptoGet(id) {
  return yield ws.getCrypto(id);
}

/**
 * Reset provider crypto
 * @param {string} id
 * @returns {Promise}
 */
export function* cryptoReset(id) {
  const crypto = yield ws.getCrypto(id);
}

/**
 * Get provider
 * @param {string} id
 * @returns {Promise}
 */
export function* providerGet(id) {
  const provider = yield cryptoGet(id);
  const isLogged = yield providerIsLogged(provider);
  return {
    provider,
    isLogged,
  };
}