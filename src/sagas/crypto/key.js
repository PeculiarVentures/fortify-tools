import { put } from 'redux-saga/effects';
import { Convert } from 'pvtsutils';
import { ErrorActions } from '../../actions/state';

/**
 * Returns index of key from key storage
 * @param {Crypto}      crypto
 * @param {CryptoKey}   key
 * @returns {string | null}
 */
export function* keyIndexOf(crypto, key) {
  return yield crypto.keyStorage.indexOf(key);
}

/**
 * Returns thumbprint of public key
 * @param {Crypto} crypto
 * @param {CryptoKey} publicKey
 */
export function* publicKeyThumbprint(crypto, publicKey, hash = 'SHA-256') {
  if (publicKey.type !== 'public') {
    throw new Error(`Wrong type of key '${publicKey.type}'. Must be 'public'`);
  }
  const spki = yield crypto.subtle.exportKey('spki', publicKey);
  // NOTE: Use native digest instead of service provider
  const thumbprint = yield window.crypto.subtle.digest(hash, spki);
  return Convert.ToHex(thumbprint);
}

/**
 * Get provider key IDs
 * @param {object} crypto
 * @returns {Promise|Array}
 */
export function* keyGetIDs(crypto) {
  return yield crypto.keyStorage.keys();
}

/**
 * Set provider key
 * @param {object} crypto
 * @param {string} key
 * @returns {Promise|[]}
 */
export function* keySet(crypto, key) {
  return yield crypto.keyStorage.setItem(key);
}

/**
 * Get provider key
 * @param {object} crypto
 * @param {string} id
 * @returns {Promise|Boolean}
 */
export function* keyGet(crypto, id) {
  try {
    return yield crypto.keyStorage.getItem(id);
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Remove provider key
 * @param {object} crypto
 * @param {string} id
 * @returns {boolean}
 */
export function* keyRemove(crypto, id) {
  yield crypto.keyStorage.removeItem(id);
}
