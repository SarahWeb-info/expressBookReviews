const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) =>{
    let username = req.body.username;
    let password = req.body.password;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send('Username or password required');
    }

    let filtered_users = users.filter((user) => user.username === username);
    if (filtered_users.length > 0) {
        return res.status(409).send('Username already exsist');
    }else{
        users.push({"username":username,"password":password});
        return res.status(201).send('Username has been added');
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    
    // if (book) {
        //   res.send(JSON.stringify(book, null, 2));
        // } else {
            //   res.status(404).send('Book not found');
            // }
            
    const get_books = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        resolve(res.send(JSON.stringify({book}, null, 4)));
      });

      reject(res.send("The mentioned ISBN for the book does not exist "));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // const requestedAuthor = req.params.author;
    // const matchingBooks = [];

    // // Iterate through the books and find those with the matching author
    // for (const key in books) {
    //     if (books[key].author === requestedAuthor) {
    //         matchingBooks.push(books[key]);
    //     }
    // }

    // res.send(JSON.stringify(matchingBooks, null, 2));
    const get_books_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
          }  
        });
        reject(res.send("The mentioned author does not exist "));
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // const requestedTitle = req.params.title;
    // const matchingTitle = [];

    // // Iterate through the books and find those with the matching author
    // for (const key in books) {
    //     if (books[key].title === requestedTitle) {
    //         matchingTitle.push(books[key]);
    //     }
    // }

    // res.send(JSON.stringify(matchingTitle, null, 2));
    const get_books_title = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["title"] === req.params.title) {
            booksbytitle.push({"isbn":isbn,
                                "author":books[isbn]["author"],
                                "reviews":books[isbn]["reviews"]});
          resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
          } 
    });
    reject(res.send("The mentioned Book with Title does not exist "))    
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        let review = books[isbn].review;
      res.send(review);
    } else {
      res.status(404).send('Book not found');
    }      
});

module.exports.general = public_users;
