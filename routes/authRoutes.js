const express = require("express")
const xss = require("xss")
const data = require("../data")
const { ObjectId } = require("mongodb")
const authValidations = require("../utils/authValidations")
const bcryptJS = require("bcryptjs")

const router = express.Router()
const authData = data.authData

router
    .route("/login")
    .get(async (req, res) => {
        if(req.session.user) {
            return res.redirect("/")
        }
        let data = {}
        let errors = {}
        console.log(req.query.bookId)
        return res.status(200).render("login", {
            title: "Login",
            showNav: false,
            hasErrors: false,
            bookId: req.query.bookId,
            data: JSON.stringify(data),
            errors: JSON.stringify(errors)
        })
    })
    .post(async (req, res) => {

        if(req.session.user) {
            return res.redirect("/")
        }
        let errors = {}
        let email = req.body.email
        let password = req.body.password

        let requestedData = {
            email: email,
            password: password
        }
        try {
            authValidations.isValidEmail(email, errors)
            authValidations.isValidPassword(password, errors)
        } catch(exception) {
            return res.status(200).render("login", {
                title: "Login",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }

        try {
            let user = await authData.authenticateUser(email, password)
            if(user == null) {
                return res.status(200).render("login", {
                    title: "Login",
                    showNav: false,
                    data: JSON.stringify(requestedData),
                    errors: JSON.stringify({
                        other: "Can not log in you at this moment, please try after some time."
                    })
                })
            }
            req.session.user = {
                _id: user._id.toString(),
                name: user.name,
                username: user.username
            }
            if (req.query.bookId) {
                return res.redirect(`/bookinfo/${req.query.bookId}`)
            }
            else {
                return res.redirect("/")
            }
        } catch(exception) {
            return res.status(200).render("login", {
                title: "Login",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }
    })

router
    .route("/signup")
    .get(async (req, res) => {
        if(req.session.user) {
            return res.redirect("/")
        }
        let data = {}
        let errors = {}
        return res.status(200).render("signup", {
            title: "Sign up",
            showNav: false,
            hasErrors: false,
            data: JSON.stringify(""),
            errors: JSON.stringify(errors)
        })
    })
    .post(async (req, res) => {
        if(req.session.user) {
            return res.redirect("/")
        }
        let name = xss(req.body.name).trim()
        let username = xss(req.body.username).trim()
        let email = xss(req.body.email).trim()
        let password = xss(req.body.password).trim()
        let reEnterPassword = xss(req.body.reEnterPassword).trim()

        let errors = {}
        let requestedData = {
            name: name,
            username: username,
            email: email,
            password: password,
            reEnterPassword: reEnterPassword
        }
        try {
            authValidations.isValidName(name, errors)
            authValidations.isValidEmail(email, errors)
            authValidations.isValidUserName(username, errors)
            authValidations.isValidPassword(password, errors)
            authValidations.isValidPassword(reEnterPassword, errors)
        } catch(exception) {
            return res.status(200).render("signup", {
                title: "Sign up",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }   

        if(password !== reEnterPassword) {
            return res.status(200).render("signup", {
                title: "Sign up",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors : JSON.stringify({
                    password: "Password do not match.",
                    reEnterPassword: "Password do not match."
                })
            })
        }

        try {
            let isUsernameUnique = await authData.isUniqueUsername(username)
            if(!isUsernameUnique) {
                return res.status(200).render("signup", {
                    title: "Sign up",
                    showNav: false,
                    hasErrors: true,
                    data: JSON.stringify(requestedData),
                    errors: JSON.stringify({
                        username: "Supplied username is already in use."
                    })
                })
            }
        } catch(exception) {
            return res.status(200).render("signup", {
                title: "Sign up",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }

        try {
            let user = await authData.createUser(name, email, username, password, reEnterPassword)
            if(user === null) {
                return res.status(200).render("signup", {
                    title: "Sign up",
                    showNav: false,
                    hasErrors: true,
                    data: JSON.stringify(requestedData),
                    errors: JSON.stringify({
                        other: "Can not sign you up at this moment, please try after some time."
                    })
                })
            }
            return res.redirect("/auth/login")
        } catch(exception) {
            return res.status(200).render("signup", {
                title: "Sign up",
                showNav: false,
                hasErrors: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }
    })
    
router
    .route("/logout")
    .get(async (req, res) => {
        req.session.destroy()
        return res.redirect("/")
    })

router
    .route("/password")
    .patch(async (req, res) => {
        if(!req.session.user) {
            return res.redirect("/auth/login")
        }

        let userId = xss(req.session.user._id).trim()
        let errors = {}
        try {
            authValidations.isValidId(userId, "user id", errors)
        } catch(exception) {
            return res.redirect("/auth/login")
        }

        let currentPassword = xss(req.body.currentPassword).trim()
        let newPassword = xss(req.body.newPassword).trim()
        let confirmPassword = xss(req.body.confirmPassword).trim()

        try {
            authValidations.checkPasswords(currentPassword, newPassword, confirmPassword, errors)
        } catch(exception) {
            return res.status(400).json(exception)
        }

        let userFromDB = null
        try {
            userFromDB = await authData.getUserById(userId)
            let isPasswordMatch = await bcryptJS.compare(currentPassword, userFromDB.password)
            if(!isPasswordMatch) {
                errors.currentPassword = "Your password do not match with current password."
                return res.status(400).json(errors)
            }
        } catch(exception) {
            return res.status(400).json(exception)
        }

        try {
            let result = await authData.updatePassword(userId, currentPassword, newPassword, confirmPassword)
            return res.status(200).json({"success":result})
        } catch(exception) {
            return res.status(400).json(exception)
        }
    })
module.exports = router