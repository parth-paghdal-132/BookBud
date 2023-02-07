const express = require("express")
const router = express.Router()
const xss = require("xss")

router
    .route("/:bookId")
    .get(async (req, res) => {
        let bookId = xss(req.params.bookId)
    })

module.exports = router