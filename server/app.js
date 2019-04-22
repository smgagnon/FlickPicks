'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./router');
const defaultSessionValues = require('./middleware/default-session-values');
const defaultErrorHandler = require('./middleware/default-error-handler');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
app.use(router);
app.use(defaultErrorHandler);

app.use(session({
  secret: process.env.SESSION_SECRET, // Used to cryptographically "sign" the session ID
  resave: false, // Forces the session to be saved back to the session store, just a sane default
  saveUninitialized: true, // All HTTP requests without a session have a session started for them
  cookie: {
    httpOnly: true, // Makes cookie inaccessible to client side JS
    maxAge: 12000000, // Cookie will expire after two hours
  },
}));

// Middleware to prepare default values for sessions
// This must come after the session middleware to ensure its values are set properly
app.use(defaultSessionValues);

// Start Server
app.listen(3000, () => {
  console.log('The Flick Picks Server Has Started');
});
