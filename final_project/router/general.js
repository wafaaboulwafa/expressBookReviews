const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(404).json({ message: "Invalid isbn parameter" });

  const bookByIsbn = books[isbn];

  if (bookByIsbn) return res.send(JSON.stringify(bookByIsbn, null, 4));
  else return res.status(404).json({ message: "Book not found for the ISBN" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author)
    return res.status(404).json({ message: "Invalid author parameter" });

  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  if (!title)
    return res.status(404).json({ message: "Invalid title parameter" });

  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  res.send(JSON.stringify(booksByTitle, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (!isbn) return res.status(404).json({ message: "Invalid isbn parameter" });

  const bookByIsbn = books[isbn];

  if (bookByIsbn) {
    const reviews = Object.values(bookByIsbn.reviews);
    const reviewsTotal = reviews.reduce((acc, review) => {
      return acc + review + "\n";
    }, 0);
    const reviewsAvg = reviewsTotal / bookByIsbn.reviews.length;

    return res.send(reviewsAvg);
  } else return res.status(404).json({ message: "Book not found for the ISBN" });
});

module.exports.general = public_users;
