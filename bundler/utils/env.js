/* eslint
  "global-require": 1,
  "import/no-extraneous-dependencies": 1,
  "no-param-reassign": 1
*/

/**
 * @example
 *  ENV_CONFIG=env/.env node index.js
 */
const { ENV_CONFIG, NODE_ENV, PACKAGE_NAME } = process.env;

function getClientEnvironment() {
  if (!ENV_CONFIG) {
    throw new Error(
      'The ENV_CONFIG environment variable is required but was not specified.',
    );
  }

  const { parsed } = require('dotenv').config({ path: process.env.ENV_CONFIG });
  parsed.NODE_ENV = NODE_ENV;

  if (!parsed.ENTRY_FOLDER && PACKAGE_NAME) {
    // Entry project folder.
    parsed.ENTRY_FOLDER = `packages/${PACKAGE_NAME}`;
  }

  if (process.env.DEBUG) {
    parsed.DEBUG = process.env.DEBUG;
  }

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = Object.keys(parsed).reduce((env, key) => {
    env[key] = JSON.stringify(parsed[key]);
    return env;
  }, {});

  return { raw: parsed, stringified };
}

module.exports = getClientEnvironment;
