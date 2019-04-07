'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const router = express.Router();

let movieCount;

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
      res.render('movies', {
        pageId: 'movies',
        title: 'Movies',
        movies,
      });
      movieCount = movies.length;
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
  const movie_id = movieCount + 1;
  const name = req.body.name.trim();
  const image = req.body.image.trim();
  const genre = req.body.genre.trim();
  const yearReleased = req.body.yearReleased.trim();
  const length = req.body.length.trim();
  const rating = req.body.rating.trim();

  if (!name) {
    res
      .status(400)
      .render('new', {
        pageId: 'new', title: 'Create New Movie', movie_id, name, image, genre, yearReleased, length, rating,
      });
  } else {
    db.createMovie({
      movie_id, name, image, genre, yearReleased, length, rating,
    })
      .then(() => {
        res.redirect(301, '/movies');
      })
      .catch(next);
  }
});


// Gets one item by ID
router.get('/movies/:id', (req, res) => {
  db.getAllMovies()
    .then((movies) => {
      // parseInt(req.params, 10);
      // console.log(req.params);
      // res.render('viewMovie', {
      //   // pageId: 'viewMovie',
      //   // title: 'Update Movie Info',
      //   movies,
      // });
      const singleMovie = movies.filter((singleMovie) =>{
        return singleMovie.movie_id == req.params.id;

      })[0]
      res.render('viewMovie', {
        singleMovie,
      })
    })
  //   .catch(next);
});


// Update movie details UNFINISHED
router.get('/movies/.id/viewMovie', (req, res) => {
  // Add code
  res.render('/viewMovie');
});

// // Update the movie :id
// router.patch('/movies/.id/update', (req, res) => {
//   // Add code
//   res.render('/movies');
// });

// Delete a movie UNFINISHED
router.delete('/movies/.id', (req, res) => {
  // Add code
  res.redirect('movies');
});


module.exports = router;


// // Get data from form and post to movies array
// router.post('/movies', (req, res) => {
//   const image = req.body.image;
//   const name = req.body.name;
//   const genre = req.body.genre;
//   const yearReleased = req.body.yearReleased;
//   const length = req.body.length;
//   const rating = req.body.rating;
//   const newMovie = {
//     name: name,
//     image: image,
//     genre: genre,
//     yearReleased: yearReleased,
//     length: length,
//     rating: rating,
//   };
//   movies.push(newMovie);
//   // Redirect back to movies page
//   res.redirect('/movies');
// });
