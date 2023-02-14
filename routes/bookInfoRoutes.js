const express = require("express")
const router = express.Router()
const xss = require("xss")
const axios = require("axios")
const {getBookByBookId, createBook, createReview} = require("../data/bookInfoData");

router
    .route("/:bookId")
    .get(async (req, res) => {
        const bookID = xss(req.params.bookId);
        let book = null
        try {
            book = await getBookByBookId(bookID)
        }
        catch (e) {
            return res.status(400).json(`Error: ${e}`);
        }

        if(book === null){
            try {
                let {data} = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookID}`)
                let volumeInfo = data.items[0].volumeInfo
                let title = volumeInfo.title
                let authors = volumeInfo.authors
                let description = volumeInfo.description
                let categories = volumeInfo.categories
                let thumbImage = volumeInfo.imageLinks.thumbnail
                book = await createBook(title, authors, description, categories, bookID, thumbImage)
            } catch(exception) {
                console.error(error);
                return res.sendStatus(500);
            }   
        }
        return res.render("bookInfo", {book: book, showNav: true, reviews: book.reviews})
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