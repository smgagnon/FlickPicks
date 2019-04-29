'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const moviesPath = path.resolve('server/db/movies.json');
const userDbPath = path.resolve('server/db/users.json');

//////////AUTHENTICATION/////////

// Reads the file `users.json` and parses its JSON
function readUsers() {
  return readFile(userDbPath)
    .then((json) => {
      return JSON.parse(json);
    });
}


// Writes to the `users.json` file
function writeUsers(users) {
  return writeFile(userDbPath, JSON.stringify(users, null, 2));
}

/**
 * Determines if a user with a particular username already exists or not
 * @param {string} username
 * @returns {Promise<boolean>} whether a user exists or not
 */
function usernameExists(username) {
  return readUsers()
    .then((users) => {
      let exists = false;

      users.forEach((user) => {
        if (user.username === username) {
          exists = true;
        }
      });

      return exists;
    });
}

/**
 * Adds a user to the database
 * @param {object} user
 * @returns {Promise<undefined>}
 */
function addUser(user) {
  return readUsers()
    .then((users) => {
      return writeUsers(users.concat(user));
    });
}

/**
 * Get user password hash
 * @param {string} username
 * @returns {Promise<string>}
 */
function getUserPasswordHash(username) {
  return readUsers()
    .then((users) => {
      let match;

      users.forEach((user) => {
        if (user.username === username) {
          match = user;
        }
      });

      if (!match) {
        throw new Error('User does not exist.');
      }

      return match.password;
    });
}


//////////MOVIES////////////////

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
        return query;
      } else {
        return movie;
      }
    })
    .then((query) => {
      return writeMovies(query);
    });
}


// async function updateMovieByName(id, updatedMovie) {
//   return readMovies()
//     .then((allMovies) => {
//           return allMovies.map((movie) => {
//             if (movie.id === id) {
//               console.log(movie.id);
//               return updatedMovie;
//             } else {
//               return movie;
//             }
//           });
//         })
//         .then((movies) => {
//           return writeMovies(movies);
//         });
//     }


// async function updateMovieByName(query) {
//   return readMovies()
//     .then((movies) => {
//     const updateMovie = movies.filter((updateMovie) => {
//       return updateMovie.id == query.id;
//       })[0];

//       if (updateMovie.id == query.id) {
//         console.log(updateMovie);
//         console.log(query);
//         // put code here to push update to the db
//           return query;
//       } else {
//         return movie;
//       }
//     })
//     .then((query) => {
//       //console.log(movies);
//       return readMovies(query);
//       // movies.splice(0, 1, query);
//       // return writeMovies(query);
//   });
// }
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

// async function deleteMovieByName(query) {
//   return readMovies()
// .then((movies) => {
//   const updateMovie = movies.filter((updateMovie) => {
//     return updateMovie.id == query.id;
//   })[0];
//   if (updateMovie.id == query.id) {
//     console.log(updateMovie);
//     return writeMovies(movies);
//   } else {
//     return movie;
//   }
// });
// }

async function deleteMovieByName(query) {
  console.log(query);
  return readMovies()
  .then((movies) => {
    return movies.filter((updateMovie) => {
      console.log(updateMovie);

    });
  })
  .then((movies) => {
    return writeMovies(movies);
 });
}


//   console.log(movie);
//   return readMovies()
//     .then((movies) => {
//       const singleMovie = movies.filter((singleMovie) => {
//         return singleMovie.id == movie.id;
//       })[0];
//       console.log(singleMovie);
//     })
//     .then((movies) => {
//       return writeMovies(movies);
//     });
// }

// .then((allMovies) => {
//   return allMovies.filter((movie) => {
//     console.log(movie);
//     return movie.name !== name;

module.exports = {
  getAllMovies: readMovies,
  getAllTitles,
  searchMovies,
  createMovie,
  updateMovieByName: updateMovieByName,
  deleteMovieByName: deleteMovieByName,
  usernameExists: usernameExists,
  addUser: addUser,
  getUserPasswordHash: getUserPasswordHash,
};
