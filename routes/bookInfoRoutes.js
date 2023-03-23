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
                let {data} = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookID}`)
                const volumeInfo = data.volumeInfo
                book = {
                    title: volumeInfo.title,
                    authors: volumeInfo.authors,
                    bookId: data.id,
                    description: volumeInfo.description,
                    categories: volumeInfo.categories,
                    thumbImage: volumeInfo.imageLinks.thumbnail,
                    previewLink: volumeInfo.previewLink,
                }
            } catch(exception) {
                console.error(exception);
                return res.sendStatus(500);
            }   
        }
        return res.render("bookInfo", {book: book, showNav: true, reviews: book.reviews})
    })
router
    .route("/:bookId/reviews")
    .post(async (req, res) => {
        let book = null
        try {
            book = await getBookByBookId(req.params.bookId)
        }
        catch (e) {
            return res.status(400).json(`Error: ${e}`);
        }
        if(book === null) {
            try {
                let {data} = await axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`)
                console.log(data)
                let volumeInfo = data.volumeInfo
                let title = volumeInfo.title
                let authors = volumeInfo.authors
                let description = volumeInfo.description
                let categories = volumeInfo.categories
                let thumbImage = volumeInfo.imageLinks.thumbnail
                let previewLink = volumeInfo.previewLink
                await createBook(title, authors, description, categories, req.params.bookId, thumbImage, previewLink)

            } catch(exception) {
                console.error(exception);
                return res.sendStatus(500);
            }
        }
        try {
            let newRecipe = await createReview(req.body.review, req.params.bookId, req.session.user._id, req.session.user.username)
            console.log(newRecipe)
            res.json(newRecipe)
        }
        catch (e) {
            return res.status(500).json(`Error: ${e}`);
        }
    })

module.exports = router