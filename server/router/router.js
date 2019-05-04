'use strict';

const express = require('express');
const methodOverride = require('method-override');
const loginRoutes = require('./login');
const logoutRoutes = require('./logout');
const registerRoutes = require('./register');
const db = require('../db');

const router = express.Router();

let movieCount;

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));


// /// Authentication /////////
// Load Landing page
router.get('/', (req, res) => {
  res.render('landing', {
    pageId: 'landing',
    title: 'Home',
    username: req.session.username,
  });
});

// Register page
router.get('/register', registerRoutes.get);
router.post('/register', registerRoutes.post);

// Login Page
router.get('/login', loginRoutes.get);
router.post('/login', loginRoutes.post);

// Logout
router.get('/logout', logoutRoutes.get);


// /// Movies /////////

// Render the movies page
router.get('/movies', (req, res) => {
  if (!req.session.username) {
    res
      .status(403)
      .render('error');
  } else {
    db.getAllMovies()
      .then((movies) => {
        res.render('movies', {
          pageId: 'movies',
          title: 'Movies',
          username: req.session.username,
          movies,
        });
        movieCount = movies.length;
      });
  }
});

// Render the create new movie page
router.get('/movies/new', (req, res) => {
  res.render('new', {
    pageId: 'new',
    title: 'Create New Movie',
    username: req.session.username,
    name: null,
  });
});

// Posts the new movie to the movie page
router.post('/movies', (req, res) => {
  const id = movieCount + 1;
  const name = req.body.name.trim();
  const image = req.body.image.trim();
  const yearReleased = req.body.yearReleased.trim();
  const genre = req.body.genre.trim();
  const length = req.body.length.trim();
  const rating = req.body.rating.trim();
  const director = req.body.director.trim();
  const price = req.body.price.trim();
  if (!name) {
    res
      .status(400)
      .redirect('/movies/new');
  } else {
    db.createMovie({
      id, name, image, genre, yearReleased, length, rating, director, price,
    })
      .then(() => {
        res.redirect(301, '/movies');
      });
  }
});

// Gets one item by ID - displays a single movie on a new page
router.get('/movies/:id', (req, res) => {
  db.getAllMovies()
    .then((movies) => {
      const singleMovie = movies.filter((singleMovie) => {
        return singleMovie.id === parseInt(req.params.id, 10);
      })[0];
      res.render('viewMovie', {
        singleMovie,
        pageId: 'viewMovie',
        title: 'Update Movie Info',
        username: req.session.username,
      });
    });
});

// Route for getting the Update Page
router.get('/movies/:id/update', (req, res) => {
  db.getAllMovies()
    .then((movies) => {
      const updateMovie = movies.filter((updateMovie) => {
        return updateMovie.id === parseInt(req.params.id, 10);
      })[0];
      res.render('update', {
        updateMovie,
        pageId: 'update',
        title: 'Update Movie ',
        username: req.session.username,
      });
    });
});

// Patch info from update movie page- not working
router.put('/movies/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const name = req.body.name;
  const image = req.body.image;
  const yearReleased = req.body.yearReleased;
  const genre = req.body.genre;
  const length = req.body.length;
  const rating = req.body.rating;
  const director = req.body.director;
  const price = req.body.price;
  db
    .updateMovieByName({
      id,
      name,
      image,
      genre,
      yearReleased,
      length,
      rating,
      director,
      price,
    })
    .then(() => {
      res.redirect(301, `/movies/${req.params.id}`);
    })
    .catch(next);
});

// Delete a movie
router.delete('/movies/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const name = req.body.name;
  const image = req.body.image;
  const yearReleased = req.body.yearReleased;
  const genre = req.body.genre;
  const length = req.body.length;
  const rating = req.body.rating;
  const director = req.body.director;
  const price = req.body.price;
  db
    .deleteMovieByName({
      id,
      name,
      image,
      genre,
      yearReleased,
      length,
      rating,
      director,
      price,
    })
    .then(() => {
      res.redirect(301, '/movies');
    })
    .catch(next);
});

module.exports = router;
