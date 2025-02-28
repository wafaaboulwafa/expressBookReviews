const {
  getAllBooks,
  getBookByIsbn,
  searchBooksByAuthor,
  searchBooksByTitle,
} = require("./api.js");

//Get all books using callback
getAllBooks(function (books) {
  console.log(books);
});

//Get a book using promise
getBookByIsbn("1").then(function (book) {
  console.log(book);
});

// Search books by author using callback
searchBooksByAuthor("Samuel Becket", function (books) {
  console.log(books);
});

// Search books by title using callback
searchBooksByTitle("Things Fall Apart", function (books) {
  console.log(books);
});
