'use strict';

const argon = require('argon2');
const db = require('../db');

// Initial page rendering
function getLoginRoute(req, res) {
  res.render('login', {
    pageId: 'login',
    title: 'Login',
    username: req.session.username,
    formError: null,
    formValues: { username: null, password: null },
  });
}

// Form submission
function postLoginRoute(req, res, next) {
  db.usernameExists(req.body.username)
    .then((usernameExists) => {
      // Login is not valid if username does not exist
      if (!usernameExists) {
        return false;
      // If the username exists verify the password is correct
      } else {
        return db.getUserPasswordHash(req.body.username)
          .then((dbHash) => {
            return argon.verify(dbHash, req.body.password);
          });
      }
    })
    .then((isValid) => {
      // If invalid respond with authentication failure
      if (!isValid) {
        res
          .status(401)
          .render('login', {
            pageId: 'login',
            title: 'Login',
            username: req.session.username,
            formError: 'Authentication failed.',
            formValues: {
              username: req.body.username || null,
              password: req.body.password || null,
            },
          });
      // Else log the user in and redirect to home page
      } else {
        req.session.username = req.body.username;
        res.redirect('/movies');
      }
    })
    .catch(next);
}


module.exports = {
  get: getLoginRoute,
  post: postLoginRoute,
};
