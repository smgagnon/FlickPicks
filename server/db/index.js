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

module.exports = {
  getAllMovies: readMovies,
  getAllTitles,
  searchMovies,
  createMovie,
};
