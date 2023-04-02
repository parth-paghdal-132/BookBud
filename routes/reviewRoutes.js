const express = require("express")
const xss = require("xss")
const data = require("../data")
const authValidations = require("../utils/authValidations")

const router = express.Router()
const bookInfoData = data.bookInfoData

router
    .route("/:username")
    .get(async (req, res) => {

        let errors = {}
        let username = xss(req.params.username).trim()

        try {
            authValidations.isValidUserName(username, errors)
        } catch(exception) {
            return res.status(200).render("userReviews", {
                hasErrors: true,
                errors: JSON.stringify(exception),
                title: "Reviews",
                showNav: true
            })
        }
        try {
            let data = await bookInfoData.getReviewsFromUsername(username)
            if(data){
                errors.other = "Hey there"
                return res.status(200).render("userReviews", {
                    errors: errors,
                    data: data,
                    title: "Reviews",
                    showNav: true
                })
            } else {
                errors.other = "Can not show review at this moment. please try after some time."
                return res.status(200).render("userReviews", {
                    hasErrors: true,
                    errors: JSON.stringify(errors),
                    title: "Reviews",
                    showNav: true
                })
            }
        } catch(exception) {
            return res.status(200).render("userReviews", {
                hasErrors: true,
                errors: JSON.stringify(exception),
                title: "Reviews",
                showNav: true
            })
        }
    })
module.exports = router