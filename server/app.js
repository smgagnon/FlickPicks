'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const defaultErrorHandler = require('./middleware/default-error-handler');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
app.use(router);
app.use(defaultErrorHandler);

// Start Server
app.listen(3000, () => {
  console.log('The Flick Picks Server Has Started');
});
