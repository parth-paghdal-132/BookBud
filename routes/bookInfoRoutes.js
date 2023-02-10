const express = require("express")
const router = express.Router()
const xss = require("xss")
const {getBookByBookId, createBook, createReview} = require("../data/bookInfoData");

router
    .route("/:bookId")
    .get(async (req, res) => {
        const bookID = xss(req.params.bookId);
        let book
        try {
            book = await getBookByBookId(bookID)
        }
        catch (e) {
            return res.status(400).json(`Error: ${e}`);
        }

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookID}`)
            .then(response => response.json())
            .then(async data => {
                // Do something with the book information
                if (book === null) {
                    const {title, author} = data.items[0].volumeInfo
                    book = await createBook(title, author, bookID)
                }
                res.render("bookInfo", {book: data.items[0], showNav: true, reviews: book.reviews})
            })
            .catch(error => {
                console.error(error);
                res.sendStatus(500);
            });
    })
router
    .route("/:bookId/reviews")
    .post(async (req, res) => {
        try {
            const newBook = await createReview(req.body.review, req.params.bookId, req.session.user._id, req.session.user.username )
            res.redirect(`/bookinfo/${req.params.bookId}`)
        }
        catch (e) {
            return res.status(500).json(`Error: ${e}`);
        }
    })

module.exports = router