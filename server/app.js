'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const router = require('./router/router');
const defaultSessionValues = require('./middleware/default-session-values');
const authentication = require('./middleware/authentication');
const defaultErrorHandler = require('./middleware/default-error-handler');

const app = express();

app.set('view engine', 'ejs');

app.use('/static', express.static('static'));

app.use(express.urlencoded({ extended: true }));

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

// Apply router
app.use(router);

// Ensure user is logged in
app.use(authentication);

// Default error handling for serving a page for 500 errors
// This is what calls to the `next` function in our routes calls
app.use(defaultErrorHandler);


// Start Server
app.listen(process.env.HTTP_PORT, () => {
  console.log('The Flick Picks Server Has Started');
});
