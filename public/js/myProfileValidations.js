let txtName = document.getElementById("name")
let txtEmail = document.getElementById("email")
let txtUsername = document.getElementById("username")

let divOtherError = document.getElementById("otherErrors")
let divSuccessNotificationArea = document.getElementById("successNotificationArea")

let errName = document.getElementById("errName")
let errEmail = document.getElementById("errEmail")
let errUsername = document.getElementById("errUsername")

let profileInformationForm = document.getElementById("profileInformationForm")

let btnCurrentPasswordToggle = document.getElementById("currentPasswordToggle")
let btnNewPasswordToggle = document.getElementById("newPasswordToggle")
let btnConfirmPasswordToggle = document.getElementById("confirmPasswordToggle")
let currentPasswordToggleIcon = document.getElementById("currentPasswordToggleIcon")
let newPasswordToggleIcon = document.getElementById("newPasswordToggleIcon")
let confirmPasswordToggleIcon = document.getElementById("confirmPasswordToggleIcon")
let btnUpdatePassword = document.getElementById("updatePassword")
let btnChangePassword = document.getElementById("changePassword")

let txtCurrentPassword = document.getElementById("currentPassword")
let txtNewPassword = document.getElementById("newPassword")
let txtConfirmPassword = document.getElementById("confirmPassword")

let errCurrentPassword = document.getElementById("errCurrentPassword")
let errNewPassword = document.getElementById("errNewPassword")
let errConfirmPassword = document.getElementById("errConfirmPassword")

btnCurrentPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtCurrentPassword, currentPasswordToggleIcon)
})

btnNewPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtNewPassword, newPasswordToggleIcon)
})

btnConfirmPasswordToggle.addEventListener("click", (event) => {
    event.preventDefault()
    togglePasswordVisibility(txtConfirmPassword, confirmPasswordToggleIcon)
})

txtNewPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

txtConfirmPassword.addEventListener("input", (event) => {
    event.preventDefault()
    checkPasswordEqual()
})

btnUpdatePassword.addEventListener("click", (event) => {
    event.preventDefault()
    updatePassword()
})

profileInformationForm.addEventListener("submit", (event) => {
    hideSuccessUpdate()
    if(!validateData()) {
        event.preventDefault()
    }
})

btnChangePassword.addEventListener("click", (event) => {
    resetPasswordTextFields()
})

function togglePasswordVisibility(txtview, iconView) {
    if(txtview.type === "password") {
        txtview.type = "text"
        iconView.classList.remove("bi-eye-slash-fill")
        iconView.classList.add("bi-eye-fill")
    } else {
        txtview.type = "password"
        iconView.classList.remove("bi-eye-fill")
        iconView.classList.add("bi-eye-slash-fill")
    }
}

function checkPasswordEqual() {
    let password = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value
    if(confirmPassword.length === 0) return
    if(password === confirmPassword) {
        txtConfirmPassword.classList.add("is-valid")
        txtConfirmPassword.classList.remove("is-invalid")
        errConfirmPassword.classList.add("valid-feedback")
        errConfirmPassword.classList.remove("invalid-feedback")
        errConfirmPassword.innerText = "Password match."
    } else {
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Password do not match."
    }
}

function updatePassword() {
    let isPasswordValid = checkIsPasswordValid()
    if (!isPasswordValid) {
        return
    }
    let currentPassword = txtCurrentPassword.value
    let newPassword = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value
    let data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    }
    $.ajax({
        url: "/auth/password",
        type: "PATCH",
        contentType:'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (data) {
            $("#passwordChangeConfirmationDialog").modal("hide")
            divSuccessNotificationArea.classList.remove("d-none")
            divSuccessNotificationArea.innerText = "Your password successfully changed."
        },
        error : function (data) {
            let errors = JSON.parse(data.responseText)
            showErrorsOfPasswordModal(errors)

            if(errors.otherErrors) {
                $("#passwordChangeConfirmationDialog").modal("hide")
                divOtherError.classList.remove("d-none")
                divOtherError.innerText = errors.otherErrors
            }
        }
    })
}

function checkIsPasswordValid() {
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    let currentPassword = txtCurrentPassword.value
    let newPassword = txtNewPassword.value
    let confirmPassword = txtConfirmPassword.value

    let isPasswordValid = true

    if(!passwordPattern.test(currentPassword)) {
        isPasswordValid = false
        txtCurrentPassword.classList.remove("is-valid")
        txtCurrentPassword.classList.add("is-invalid")
        errCurrentPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtCurrentPassword.classList.remove("is-invalid")
    }

    if(!passwordPattern.test(newPassword)) {
        isPasswordValid = false
        txtNewPassword.classList.remove("is-valid")
        txtNewPassword.classList.add("is-invalid")
        errNewPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtNewPassword.classList.remove("is-invalid")
    }

    if(!passwordPattern.test(confirmPassword)) {
        isPasswordValid = false
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Your password do not match with the password criteria."
    } else {
        txtConfirmPassword.classList.remove("is-invalid")
    }

    if(newPassword === currentPassword) {
        isPasswordValid = false
        txtNewPassword.classList.remove("is-valid")
        txtNewPassword.classList.add("is-invalid")
        errNewPassword.classList.add("invalid-feedback")
        errNewPassword.classList.remove("valid-feedback")
        errNewPassword.innerText = "Your new password is the same as current password."
    }

    if (newPassword !== confirmPassword) {
        isPasswordValid = false
        txtConfirmPassword.classList.remove("is-valid")
        txtConfirmPassword.classList.add("is-invalid")
        errConfirmPassword.classList.add("invalid-feedback")
        errConfirmPassword.classList.remove("valid-feedback")
        errConfirmPassword.innerText = "Password do not match."
    }
    return isPasswordValid
}

function showErrorsOfPasswordModal(errors) {
    showServerReponseError(txtCurrentPassword, errCurrentPassword, errors.currentPassword)
    showServerReponseError(txtNewPassword, errNewPassword, errors.newPassword)
    showServerReponseError(txtConfirmPassword, errConfirmPassword, errors.confirmPassword)
}

function showServerReponseError(textField, errorField, errorMessage) {
    if(errorMessage !== undefined) {
        showError(textField, errorField, errorMessage)
    } else {
        hideError(textField)
    }
}

function showError(textField, errorField, errorMessage) {
    textField.classList.add("is-invalid")
    errorField.innerText = errorMessage
}

function hideError(textField) {
    textField.classList.remove("is-invalid")
}

function resetPasswordTextFields() {
    txtCurrentPassword.value = null
    txtNewPassword.value = null
    txtConfirmPassword.value = null

    hideError(txtCurrentPassword)
    hideError(txtNewPassword)
    hideError(txtConfirmPassword)
    txtConfirmPassword.classList.remove("is-valid")
}

function validateData() {
    let name = txtName.value.trim()
    let username = txtUsername.value.trim()

    let isValidData = true

    const nameRegex = /[a-zA-Z]{3,}[\s]{1}[a-zA-Z]{3,}$/
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/

    if(!name) {
        showError(txtName, errName, "You must supply name.")
        isValidData = false
    } else if(name.length === 0) {
        showError(txtName, errName, "Supplied name can not be empty.")
        isValidData = false
    } else if(!nameRegex.test(name)) {
        showError(txtName, errName, "Please supply valid name.")
        isValidData = false
    } else {
        hideError(txtName)
    }

    if(!username || username.length === 0) {
        showError(txtUsername, errUsername, "Username should not be empty.")
        isValidData = false
    } else if (!usernameRegex.test(username)){
        showError(txtUsername, errUsername, "Please provide valid username.")
        isValidData = false
    } else {
        hideError(txtUsername)
    }
    return isValidData
}

function fillData(user) {
    txtName.value = user.name
    txtEmail.value = user.email
    txtUsername.value = user.username
    
}

function showErrors(errors) {
    showServerReponseError(txtName, errName, errors.name)
    showServerReponseError(txtUsername, errUsername, errors.username)

    if(errors.otherErrors !== undefined) {
        divOtherError.classList.remove("d-none")
        divOtherError.innerText = errors.otherErrors
    } else {
        divOtherError.classList.add("d-none")
    }
}

function showSuccessUpdate() {
    divSuccessNotificationArea.classList.remove("d-none")
    divSuccessNotificationArea.innerText = "Your profile information has been updated successfully."
}

function hideSuccessUpdate() {
    divSuccessNotificationArea.classList.add("d-none")
}