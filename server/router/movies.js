'use strict';

function getMoviesRoutes(req, res) {
  if (!req.session.username) {
    res
      .status(403)
      .render('/');
  } else {
    res.render('movies', {
      pageId: 'movies',
      title: 'Movies',
      username: req.session.username,
    });
  }
}


module.exports = { get: getMoviesRoutes };
