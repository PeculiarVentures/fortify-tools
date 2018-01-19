import isMobile from 'ismobilejs';

/**
 * Check state on webcrypto required and user not yet sign
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (isMobile.tablet || isMobile.phone) {
    return true;
  }
  return false;
}
