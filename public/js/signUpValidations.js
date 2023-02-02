let txtName = document.getElementById("name")
let txtEmail = document.getElementById("email")
let txtUsername = document.getElementById("username")
let txtPassword = document.getElementById("password")
let txtReEnterPassword = document.getElementById("reEnterPassword")

let btnPasswordToggle = document.getElementById("btnPasswordToggle")
let btnReEnterPasswordToggle = document.getElementById("btnReEnterPasswordToggle")
let imgPasswordToggle = document.getElementById("passwordToggle")
let imgReEnterPasswordToggle = document.getElementById("reEnterPasswordToggle")

let divOtherError = document.getElementById("otherErrors")
let errName = document.getElementById("errName")
let errEmail = document.getElementById("errEmail")
let errUsername = document.getElementById("errUsername")
let errPassword = document.getElementById("errPassword")
let errReEnterPassword = document.getElementById("errReEnterPassword")

let signUpForm = document.getElementById("signUpForm")

btnPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtPassword, imgPasswordToggle)
})

btnReEnterPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtReEnterPassword, imgReEnterPasswordToggle)
})

txtPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

txtReEnterPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

signUpForm.addEventListener("submit", (event) => {
    hideOtherErrorArea()
    if(!isValidData()) {
        event.preventDefault
    }
})

function togglePasswordVisibility(textView, iconView) {
    if(textView.type === "password") {
        textView.type = "text"
        iconView.classList.remove("bi-eye-slash-fill")
        iconView.classList.add("bi-eye-fill")
    } else {
        textView.type = "password"
        iconView.classList.remove("bi-eye-fill")
        iconView.classList.add("bi-eye-slash-fill")
    }
}

function checkPasswordEqual() {
    let password = txtPassword.value
    let reEnterPassword = txtReEnterPassword.value
    if(reEnterPassword.length === 0) return

    if(password === reEnterPassword) {
        txtReEnterPassword.classList.add("is-valid")
        txtReEnterPassword.classList.remove("is-invalid")
        errReEnterPassword.classList.add("valid-feedback")
        errReEnterPassword.classList.remove("invalid-feedback")
        errReEnterPassword.innerText = "Password match."
    } else {
        txtReEnterPassword.classList.remove("is-valid")
        txtReEnterPassword.classList.add("is-invalid")
        errReEnterPassword.classList.add("invalid-feedback")
        errReEnterPassword.classList.remove("valid-feedback")
        errReEnterPassword.innerText = "Password do not match."
    }
}

function hideOtherErrorArea() {
    divOtherError.classList.add("d-none")
}

function showError(textView, errorView, errorMessage) {
    textView.classList.add("is-invalid")
    errorView.innerText = errorMessage
}

function hideError(textView) {
    textView.classList.remove("is-invalid")
}

function showServerResponse(textView, errorView, data, errorMessage) {
    if(data) {
        textView.value = data
    }
    if(errorMessage){
        showError(textView, errorView, errorMessage)
    } else {
        hideError(textView)
    }
}

function isValidData() {
    let isValidData = true

    let name = txtName.value.trim()
    let email = txtEmail.value.trim()
    let username = txtUsername.value.trim()
    let password = txtPassword.value.trim()
    let reEnterPassword = txtReEnterPassword.value.trim()

    const namePattern = /[a-zA-Z]{3,}[\s]{1}[a-zA-Z]{3,}$/
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const usernamePattern = /^[a-zA-Z0-9]{3,}$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

    if(!name) {
        showError(txtName, errName, "You must supply name.")
        isValidData = false
    } else if(name.length === 0) {
        showError(txtName, errName, "Supplied name can not be empty.")
        isValidData = false
    } else if(!namePattern.test(name)) {
        showError(txtName, errName, "Please supply valid name.")
        isValidData = false
    } else {
        hideError(txtName)
    }

    if(!email) {
        showError(txtEmail, errEmail, "You must supply e-mail.")
        isValidData = false
    } else if(email.length === 0) {
        showError(txtEmail, errEmail, "Supplied email can not be empty.")
        isValidData = false
    } else if(!emailPattern.test(email)) {
        showError(txtEmail, errEmail, "Please supply valid e-mail.")
        isValidData = false
    } else {
        hideError(txtEmail)
    }

    if(!username) {
        showError(txtUsername, errUsername, "You must supply username.")
        isValidData = false
    } else if(username.length === 0) {
        showError(txtUsername, errUsername, "Supplied username can not be empty.")
        isValidData = false
    } else if(!usernamePattern.test(email)) {
        showError(txtUsername, errUsername, "Please supply valid username.")
        isValidData = false
    } else {
        hideError(txtUsername)
    }

    if(!password){
        showError(txtPassword, errPassword, "You must supply password.")
        isValidData = false
    } else if(password.length === 0) {
        showError(txtPassword, errPassword, "Supplied password can not be empty.")
        isValidData = false
    } else if(!passwordPattern.test(password)) {
        showError(txtPassword, errPassword, "Please supply valid password.")
        isValidData = false
    } else {
        hideError(txtPassword)
    }

    if(!reEnterPassword) {
        showError(txtReEnterPassword, errReEnterPassword, "You must re enter password.")
        isValidData = false
    } else if(reEnterPassword.length === 0) {
        showError(txtReEnterPassword, errReEnterPassword, "Re entered password can not be empty.")
        isValidData = false
    } else if(!passwordPattern.test(reEnterPassword)) {
        showError(txtReEnterPassword, errReEnterPassword, "Please re enter valid password.")
        isValidData = false
    } else {
        hideError(txtReEnterPassword)
    }

    return isValidData
}

function showErrorAndFillData(errors, data) {
    showServerResponse(txtName, errName, data.name, errors.name)
    showServerResponse(txtEmail, errEmail, data.email, errors.email)
    showServerResponse(txtUsername, errUsername, data.username, errors.username)
    showServerResponse(txtPassword, errPassword, data.password, errors.password)
    showServerResponse(txtReEnterPassword, errReEnterPassword, data.reEnterPassword, errors.reEnterPassword)

    if(errors.other) {
        divOtherError.classList.remove("d-none")
        divOtherError.innerText = errors.other 
    } else {
        divOtherError.classList.add("d-none")
    }
}
