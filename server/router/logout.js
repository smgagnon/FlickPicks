'use strict';

function getLogoutRoute(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  });
}


module.exports = { get: getLogoutRoute };
