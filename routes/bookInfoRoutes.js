const express = require("express")
const router = express.Router()
const xss = require("xss")

router
    .route("/:bookId")
    .get(async (req, res) => {
        const bookID = xss(req.params.bookId);

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookID}`)
            .then(response => response.json())
            .then(data => {
                // Do something with the book information
                console.log(data)
                res.render("bookInfo", {book: data.items[0], showNav: true})
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    })

module.exports = router