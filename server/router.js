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
  res.render('login', {
    pageId: 'login',
    title: 'Login',
    //username: req.session.username,
  });
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

// router.put('/movie/:name', (req, res, next) => {
//   db.updateMovieByName(req.params.name, req.body)
//     .then((movies) => {
//       res.render('update', {
//         pageId: 'update',
//         title: 'Update',
//         movies: movies,
//       });
//     })
//     .catch((error) => {
//       return next(error);
//     });
// });


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


// router.put('/movies/:id', (req, res, next) => {
//   db.updateMovie(req.params.id, req.body, function (err, updatedMovie){
//     if(err){
//       res.redirect('movies');
//     } else {
//       res.redirect('movies/' + req.params.id);
//     }
//   });
// });


// // Delete a movie UNFINISHED
// router.delete('/movies/.id', (req, res) => {
//   // Add code
//   res.redirect('movies');
// });


module.exports = router;
