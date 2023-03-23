const express = require("express")
const router = express.Router()

router
    .route("/")
    .get(async (req, res) => {
        return res.render("home", {
            title: "Home",
            showNav: true
        })
    })

module.exports = router