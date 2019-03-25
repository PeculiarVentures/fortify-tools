/* eslint "import/no-extraneous-dependencies": 1 */

require("./config");

const express = require('express');
const path = require('path');
const getClientEnvironment = require('../utils/env');

const env = getClientEnvironment();
const app = express();

app.use(express.static(path.join(__dirname, `../../${env.raw.OUTPUT_FOLDER}`)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, `../../${env.raw.OUTPUT_FOLDER}/index.html`));
});

app.listen(env.raw.PORT);
