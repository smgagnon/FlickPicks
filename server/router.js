'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const db = require('./db');

const router = express.Router();

let movieCount;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride('_method'));

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
  try {
    res.render('./login');
  } catch (next) {
    res.render('error');
  }
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
  })
    .catch(next);
});

// Posts the new movie to the movie page
router.post('/movies', (req, res, next) => {
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
      .render('new', {
        pageId: 'new', title: 'Create New Movie', id, name, image, genre, yearReleased, length, rating,
      });
  } else {
    db.createMovie({
      id, name, image, genre, yearReleased, length, rating, director, price,
    })
      .then(() => {
        res.redirect(301, '/movies');
      })
      .catch(next);
  }
});

// Gets one item by ID - displays a single movie on a new page
router.get('/movies/:id', (req, res) => {
  db.getAllMovies()
    .then((movies) => {
      const singleMovie = movies.filter((singleMovie) => {
        return singleMovie.id == req.params.id;
      })[0];
      res.render('viewMovie', {
        singleMovie,
        pageId: 'viewMovie',
        title: 'Update Movie Info',
      });
    });
});

// Route for getting the Update Page
router.get('/movies/:id/update', (req, res) => {
  db.getAllMovies()
    .then((movies) => {
      const updateMovie = movies.filter((updateMovie) => {
        return updateMovie.id == req.params.id;
      })[0];
      res.render('update', {
        updateMovie,
        pageId: 'update',
        title: 'Update Movie ',
      });
    });
});

// Patch info from update movie page- not working
router.put('/movies/:id', (req, res, next) => {
  db.updateMovie(req.params.name, req.body)
    .then((movies) => {
      res.redirect(301, `/movies${updateMovie.id}`);
    })
    .catch(next);
});


// // Update the movie :id
// router.patch('/movies/.id/update', (req, res) => {
//   res.render('/movies');
// });

// // Delete a movie UNFINISHED
// router.delete('/movies/.id', (req, res) => {
//   // Add code
//   res.redirect('movies');
// });


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
