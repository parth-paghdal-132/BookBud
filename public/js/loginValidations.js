let txtEmail = document.getElementById("email")
let txtPassword = document.getElementById("password")

let errEmail = document.getElementById("errEmail")
let errPassword = document.getElementById("errPassword")

let divOtherError = document.getElementById("otherErrors")
let btnPasswordToggle = document.getElementById("btnPasswordToggle")
let imgPasswordToggle = document.getElementById("passwordToggle")
let loginForm = document.getElementById("loginForm")

btnPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtPassword, imgPasswordToggle)
})

loginForm.addEventListener("submit", (event) => {
    hideOtherErrorArea()
    if(!isValidData()) {
        event.preventDefault()
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

    let email = txtEmail.value.trim()
    let password = txtPassword.value.trim()

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

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

    return isValidData
}

function showErrorAndFillData(errors, data) {
    showServerResponse(txtEmail, errEmail, data.email, errors.email)
    showServerResponse(txtPassword, errPassword, data.password, errors.password)

    if(errors.other) {
        divOtherError.classList.remove("d-none")
        divOtherError.innerText = errors.other 
    } else {
        divOtherError.classList.add("d-none")
    }
}