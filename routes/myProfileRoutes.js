const express = require("express")
const router = express.Router()
const xss = require("xss")
const authValidations = require("../utils/authValidations")
const data = require("../data")

const authData = data.authData

router
    .route("/")
    .get(async (req, res) => {
        if(!req.session.user) {
            return res.redirect("/auth/login")
        }

        let userId = xss(req.session.user._id).trim()
        let errors = {}
        try {
            authValidations.isValidId(userId, "user id",errors)
        } catch (exception) {
            return res.redirect("/login")
        }

        try {
            let user = await authData.getUserById(userId)
            return res.status(200).render("myProfile", {
                title: "My Profile",
                showNav: true,
                hasData: true,
                hasError: false,
                data: JSON.stringify(user)
            })    
        } catch (exception) {
            return res.redirect("/login")
        }
    })
    .post(async (req, res) => {
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

        let userFromDB = null
        try {
            userFromDB = await authData.getUserById(userId)
        } catch (exception) {
            return res.redirect("/login")
        }
        
        let name = xss(req.body.name).trim()
        let username = xss(req.body.username).trim()

        const requestedData = {
            name: name,
            username: username,
            email: userFromDB.email
        }

        try {
            authValidations.isValidName(name, errors)
            authValidations.isValidUserName(username, errors)
        } catch(exception) {
            return res.status(400).render("myProfile", {
                title: "My profile",
                showNav: true,
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(errors)
            })
        }  
        
        try {
            let isUsernameExist = await authData.isUsernameExist(username, userId)
            if(isUsernameExist) {
                errors.username = "Username exists. please choose another one."
                return res.status(400).render("myProfile", {
                    title: "My Profile",
                    showNav:true,
                    hasData: true,
                    hasError: true,
                    data: JSON.stringify(requestedData),
                    errors: JSON.stringify(errors)
                })  
            }
        } catch(exception) {
            errors.username = "Username exists. please choose another one."
            return res.status(400).render("myProfile", {
                title: "My Profile",
                showNav:true,
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(errors)
            }) 
        }

        try {
            const updatedUser = await authData.updateUser(userId, name, username)
            if(updatedUser !== null) {
                req.session.user.username = updatedUser.username
                req.session.user.name = updatedUser.name
                return res.status(200).render("myProfile", {
                    title: "My Profile",
                    showNav: true,
                    hasData: true,
                    hasError: false,
                    isUpdated: true,
                    data: JSON.stringify(updatedUser)
                })
            }
        } catch(exception) {
            return res.status(400).render("myProfile", {
                title: "My Profile",
                showNav: true,
                hasData: true,
                hasError: true,
                data: JSON.stringify(requestedData),
                errors: JSON.stringify(exception)
            })
        }
    }) 

module.exports = router