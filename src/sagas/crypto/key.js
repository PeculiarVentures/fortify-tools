import { put } from 'redux-saga/effects';
import { ErrorActions } from '../../actions/state';

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
