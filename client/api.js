const axios = require("axios");

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// Get all books using callback
function getAllBooks(callback) {
  apiClient.get("/").then(function (response) {
    callback(response.data);
  });
}

// Get a book by ISBN using promise
function getBookByIsbn(isbn) {
  return new Promise((resolve, reject) => {
    apiClient
      .get(`/isbn/${isbn}`)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

// Search books by author using callback
function searchBooksByAuthor(author, callback) {
  apiClient.get(`/author/${author}`).then(function (response) {
    callback(response.data);
  });
}

// Search books by title using callback
function searchBooksByTitle(title, callback) {
  apiClient.get(`/title/${title}`).then(function (response) {
    callback(response.data);
  });
}

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByIsbn = getBookByIsbn;
module.exports.searchBooksByAuthor = searchBooksByAuthor;
module.exports.searchBooksByTitle = searchBooksByTitle;
