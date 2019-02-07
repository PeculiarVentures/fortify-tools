const { execSync } = require('child_process');
const uuid = require('./uuid');

module.exports = function getCommitHash(short) {
  try {
    const command = short ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD';
    return execSync(command).toString().replace(/\n/, '');
  } catch (error) {
    return uuid();
  }
};
