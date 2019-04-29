'use strict';

let argon = require('argon2');
let db = require('../db');


/**
 * Initial page rendering
 */
function getRegisterRoute(req, res) {
  res.render('register', {
    pageId: 'register',
    title: 'Register',
    username: req.session.username,
    formValues: { username: null, password: null },
    formErrors: { username: null, password: null },
  });
}


/**
 * Form submission
 */
function postRegisterRoute(req, res, next) {
  // First we check if the username provided already exists
  db.usernameExists(req.body.username)
    .then((usernameExists) => {
      // Check if form values are valid
      let formErrors = {
        username: (!usernameExists && req.body.username) ? null : 'Invalid username',
        password: (req.body.password && req.body.password.length >= 6) ? null : 'Invalid password',
      };

      // If there are any errors do not register the user
      if (formErrors.username || formErrors.password) {
        res
          .status(400)
          .render('register', {
            pageId: 'register',
            title: 'Register',
            username: req.session.username,
            formErrors: formErrors,
            formValues: {
              username: req.body.username,
              password: req.body.password,
            },
          });
      // Else if the form values are valid
      } else {
        return argon.hash(req.body.password)
          .then((dbHash) => {
            let newUser = {
              username: req.body.username,
              password: dbHash,
            };

            return db.addUser(newUser);
          })
          .then(() => {
            res.redirect('/login');
          });
      }
    })
    .catch(next);
}


module.exports = {
  get: getRegisterRoute,
  post: postRegisterRoute,
};
