'use strict';

// Check if a user is logged in
module.exports = function authenticationMiddleware(req, res, next) {
  if (!req.session.username) {
    res
      .status(401)
      .redirect('/login');
  } else {
    next();
  }
};
