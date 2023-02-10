const xss = require("xss")
const bcryptJS = require("bcryptjs")
const mongoCollections = require("../config/mongoCollections")
const { ObjectId } = require("mongodb")
const authValidations = require("../utils/authValidations")

const users = mongoCollections.users
const createUser = async (name, email, username, password, reEnterPassword) => {
    name = xss(name).trim()
    email = xss(email).trim()
    username = xss(username).trim()
    password = xss(password).trim()
    reEnterPassword = xss(reEnterPassword).trim()
    let errors = { }

    authValidations.isValidName(name, errors)
    authValidations.isValidEmail(email, errors)
    authValidations.isValidUserName(username, errors)
    authValidations.isValidPassword(password, errors)
    authValidations.isValidPassword(reEnterPassword, errors)

    if(password !== reEnterPassword) {
        errors.password = "Password do not match."
        errors.reEnterPassword = "Password do not match."
        throw errors
    }

    let isUsernameUnique = await isUniqueUsername(username)
    if(!isUsernameUnique) {
        errors.username = "Supplied username is in use."
        throw errors
    }

    let hashedPassword = await bcryptJS.hash(password, 10)
    const user = {
        name : name,
		username: username.toLowerCase(),
        email: email,
		password: hashedPassword,
        reviews: []
	}
    const usersCollection = await users()
    const insertInfo = await usersCollection.insertOne(user)

    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        errors.other = "Could not create movie"
        errors.code = 500
		throw errors
	}

    return getUserById(insertInfo.insertedId.toString())
}

const authenticateUser = async (email, password) => {
    email = xss(email).trim()
    password = xss(password).trim()

    let errors = {}
    authValidations.isValidEmail(email, errors)
    authValidations.isValidPassword(password, errors)

    const usersCollection = await users()
    const user = await usersCollection.findOne({email: email})
    if(user === null) {
        errors.other = "Either the email or password is invalid"
        throw errors
    }

    let isPasswordMath = await bcryptJS.compare(password, user.password)
	if(!isPasswordMath) {
		errors.other = "Either the email or password is invalid"
        throw errors
	}

    return user
}

const isUniqueUsername = async (username) => {
    username = xss(username).trim()

    let errors = {}
    authValidations.isValidUserName(username, errors)
    const usersCollection = await users()
    const userList = await usersCollection.find({username: username.toLowerCase()}).toArray()
    if (userList === null) {
        return true
    }
    if (userList.length === 0) {
        return true
    }
    return false
}

const isUsernameExist = async (username, userId) => {
    username = xss(username).trim()
    userId = xss(userId).trim()

    let errors = {}
    authValidations.isValidUserName(username, errors)
    authValidations.isValidId(userId, "user id", errors)

    const usersCollection = await users()
    const condition = {
        $and: [
            { username: username.toLowerCase() },
            { _id: { $ne: ObjectId(userId) } }
        ]
    }
    const userList = await usersCollection.find(condition).toArray()
    if (userList === null) {
        return false
    }
    if (userList.length > 0) {
        return true
    }
    return false
}

const getUserById = async (userId) => {
    userId = xss(userId).trim()
    let errors = {}

    authValidations.isValidId(userId, "user id", errors)


    const usersCollection = await users()
    const user = await usersCollection.findOne({_id: new ObjectId(userId)})


    if(user === null) {
        errors.other = "Either the username or password is invalid"
        errors.code = 404
        throw errors
    }


    return user
}

module.exports = {
    createUser,
    authenticateUser,
    isUniqueUsername,
    isUsernameExist,
    getUserById
}