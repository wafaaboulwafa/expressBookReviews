const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "user1", password: "1234" }];

const isValid = (username) =>
  users.findIndex((user) => user.username === username) > -1;

const authenticatedUser = (username, password) =>
  users.findIndex(
    (user) => user.username === username && user.password === password
  ) > -1;

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { rate, comment } = req.body;
  if (!isbn) return res.status(404).json({ message: "Invalid isbn parameter" });
  const bookByIsbn = books[isbn];
  if (bookByIsbn) {
    bookByIsbn.reviews[req.session.authorization.username] = { rate, comment };
    return res.json(bookByIsbn);
  } else {
    return res.status(404).json({ message: "Book not found for the ISBN" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) return res.status(404).json({ message: "Invalid isbn parameter" });
  const bookByIsbn = books[isbn];
  if (bookByIsbn) {
    delete bookByIsbn.reviews[req.session.authorization.username];
    return res.json(bookByIsbn);
  } else {
    return res.status(404).json({ message: "Book not found for the ISBN" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
