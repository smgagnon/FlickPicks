'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const moviesPath = path.resolve('server/db/movies.json');

// Reads and returns contents of movies.json
async function readMovies() {
  return readFile(moviesPath)
    .then((contents) => {
      return JSON.parse(contents);
    });
}

// Replaces the contents of movies.json
async function writeMovies(movies) {
  const json = JSON.stringify(movies, null, 2);
  return writeFile(moviesPath, json);
}

// Gets a list of each unique movie
async function getAllTitles() {
  return readMovies()
    .then((movies) => {
      const names = [];
      movies.forEach((movie) => {
        if (!names.includes(movie.name)) {
          names.push(movie.name);
        }
      });
      return names;
    });
}

// Gets a filtered list of all movies that meet all search conditions
async function searchMovies(query) {
  return readMovies()
    .then((movies) => {
      const matches = [];
      movies.forEach((movie) => {
        // If movie name in query even partially exists in any movie name
        let isMovieMatch = true;
        if (movie.name && query.name) {
          isMovieMatch = movie.name.toLowerCase()
            .includes(query.name.toLowerCase());
        }

        // Movie title condition
        const isTitleMatch = !query.name || query.name === movie.name;

        // Pushes if conditions are met
        if (isMovieMatch && isTitleMatch) {
          matches.push(movie);
        }
      });
      return matches;
    });
}

// Adds a new movie to movies.json if it is valid
async function createMovie(movie) {
  // Validate title is a non empty string
  if (!movie.name || typeof movie.name !== 'string') {
    throw new Error('Title does not exist.');
  }

  return readMovies()
    .then((movies) => {
    // Ensures name is unique
      movies.forEach((a) => {
        if (a.name === movie.name) {
        // Function won't execute including not executing movies.push(movie);
          throw new Error('Movie already exists.');
        }
      });
      movies.push(movie);
      return writeMovies(movies);
    });
}

// Updates the original movie with the new data entered in the update form
async function updateMovieByName(query) {
  console.log(query);
  return readMovies()
    .then((movies) => {
    const updateMovie = movies.filter((updateMovie) => {
      return updateMovie.id == query.id;
      })[0];

      if (updateMovie.id == query.id) {
        console.log(updateMovie);
        // put code here to push update to the db
        return updateMovie;
      } else {
        return movie;
      }
    })
    .then((updateMovie) => {
      return writeMovies(updateMovie);
    });
}
//     .then((allMovies) => {
//       return allMovies.map((movie) => {
//         if (movie.name === name) {
//           return updatedMovie;
//         } else {
//           return movie;
//         }
//       });
//     })
//     .then((movies) => {
//       return writeMovies(movies);
//     });
// }


//   return readFile(moviesPath)
//     .then((allMovies) => {
//       const updatedAllMovies = [];

//       allMovies.forEach((movie) => {
//         if (movie.id !== id) {
//           updatedAllMovies.push(movie.id);
//         } else {
//           updatedAllMovies.push(updatedMovie.id);
//         }
//       });
//       return writeMovies(updatedAllMovies);
//     });
// }

module.exports = {
  getAllMovies: readMovies,
  getAllTitles,
  searchMovies,
  createMovie,
  updateMovieByName,
};
