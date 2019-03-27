'use strict';

const express = require('express');

const app = express();
const router = require('./router');

app.use(router);
app.set('view engine', 'ejs');

// Start Server
app.listen(3000, () => {
  console.log('The Flick Picks Server Has Started');
});
