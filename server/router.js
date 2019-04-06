'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

// Load Landing page
router.get('/', (req, res) => {
  res.render('landing', {
    pageId: 'landing',
    title: 'Home',
  });
});

// Register route
router.get('/register', (req, res) => {
  res.render('./register');
});

// Login Route
router.get('/login', (req, res) => {
  res.render('./login');
});

// Render the movies page
router.get('/movies', (req, res, next) => {
  db.getAllMovies()
    .then((movies) => {
      // movies.forEach((movie) => {
      //   movies.push(movie);
      // });
      res.render('movies', {
        pageId: 'movies',
        title: 'Movies',
        movies: movies,
      });
    })
    .catch(next);
});

// Render the create new movie page
router.get('/movies/new', (req, res) => {
  res.render('new', {
    pageId: 'new',
    title: 'Create New Movie',
    name: null,
  });
});

router.post('/new', (req, res, next) => {
  const name = req.body.name.trim();
  const image = req.body.image.trim();
  const genre = req.body.genre.trim();
  const year_released = req.body.year_released.trim();
  const length = req.body.length.trim();
  const rating = req.body.rating.trim();

  if (!name) {
    res
      .status(400)
      .render('new', {
        pageId: 'new',
        title: 'Create New Movie',
        name: name,
        image: image,
        genre: genre,
        year_released: year_released,
        length: length,
        rating: rating,
      });
  } else {
    db.createMovie({
      name: name,
      image: image,
      genre: genre,
      year_released: year_released,
      length: length,
      rating: rating,
    })
      .then(() => {
        res.redirect(301, '/movies');
      })
      .catch(next);
  }
});

// // Get data from form and post to movies array
// router.post('/movies', (req, res) => {
//   const image = req.body.image;
//   const name = req.body.name;
//   const genre = req.body.genre;
//   const year_released = req.body.year_released;
//   const length = req.body.length;
//   const rating = req.body.rating;
//   const newMovie = {
//     name: name,
//     image: image,
//     genre: genre,
//     year_released: year_released,
//     length: length,
//     rating: rating,
//   };
//   movies.push(newMovie);
//   // Redirect back to movies page
//   res.redirect('/movies');
// });

// Shows more info about one movie.
router.get('/movies/:id', (req, res) => {
  res.render('/');
  // Find the show with provided ID
  // Render show template with that movie
  // res.render('/movie/movieDetails');
  // Add code
});

// Update movie details UNFINISHED
router.get('/movies/.id/update', (req, res) => {
  // Add code
  res.render('/update');
});

// Update the movie :id
router.patch('/movies/.id/update', (req, res) => {
  // Add code
  res.render('/movies');
});

// Delete a movie UNFINISHED
router.delete('/movies/.id', (req, res) => {
  // Add code
  res.redirect('movies');
});


module.exports = router;
