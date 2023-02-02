const { ObjectId } = require('mongodb')

const usernamePattern = /^[a-zA-Z0-9]{3,}$/
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

const isValidUserName = (str, errors) => {
    if(!str) {
        errors.username = "You must supply username."
        throw errors
    }
    if(typeof str !== "string") {
        errors.username = "Supplied username must be in string format."
        throw errors
    }
    if(str.length == 0) {
        errors.username = "Supplied username can not be empty."
        throw errors
    }

    if(!(usernamePattern.test(str))) {
        errors.username = "Provided username is not valid. Your username must be 3 or more charcter long and contain alphabets and/or number."
        throw errors
    }
}

const isValidEmail = (str, errors) => {
    if(!str) {
        errors.email = "You must supply email."
        throw errors
    }
    if(typeof str !== "string") {
        errors.email = "Supplied email must be in string format."
        throw errors
    }
    if(email.length == 0) {
        errors.email = "Supplied email can not be empty."
        throw errors
    }
    if(!(emailPattern.test(str))) {
        errors.email = "Invalid email address supplied."
        throw errors
    }
}

const isValidPassword = (str, errors) => {
    if(!str) {
        errors.password = "You must supply pasword."
        throw errors
    }
    if(typeof str !== "string") {
        errors.password = "Supplied password must be in string format."
        throw errors
    }
    if(str.length == 0) {
        errors.password = "Supplied password can not be empty."
        throw errors
    }
    if(!passwordPattern.test(str)) {
        errors.password = "Invalid password provided. Your password must be 6 or more character long which should contain at least one uppercase character, at least one lowercase character, at least one number, at least one special character."
        throw errors
    }
}

const isValidName = (str, errors) => {
    if(!str) {
        errors.name = "You must supply name."
        throw errors
    }
    if(typeof str !== "string") {
        errors.name = "Supplied name must be in string format."
        throw errors
    }
    if(str.length === 0) {
        errors.name = "Supplied name can not be empty."
        throw errors
    }
    if(!(/[a-zA-Z]{3,}[\s]{1}[a-zA-Z]{3,}$/.test(str))){
        errors.name = "Please provide valid name."
        throw errors
    }
}

const isValidId = (id, message, errors) => {
    if (!id) {
        errors.id = `You must provide an ${message} to perform operation.`
        throw errors
    }
    if (typeof id !== 'string') {
        errors.id = `${message} must be a string.`
        throw errors
    }
    if (id.trim().length === 0){
        errors.id = `${message} cannot be an empty string or just spaces.`
        throw errors
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
        errors.id = `invalid ${message} provided.`
        throw errors
    } 
}

module.exports = {
    isValidUserName,
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidId,
}
