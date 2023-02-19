function showEditReviewModal(reviewId, reviewMessage, parent, reviewRow) {
    $("#reviewEditDialog").modal("show")
    let txtReviewMessage = document.getElementById("reviewMessage")
    txtReviewMessage.value = reviewMessage

    let btnReviewDelete = document.getElementById("reviewDelete")
    let btnReviewUpdate = document.getElementById("reviewUpdate")

    btnReviewDelete.addEventListener("click", (event) => {
        deleteReview(reviewId, parent, reviewRow)
    })

    btnReviewUpdate.addEventListener("click", (event) => {
        updateReview(reviewId, txtReviewMessage.value, reviewRow)
    })
}

let editReviewForm = document.getElementById("editReviewForm")
editReviewForm.addEventListener("submit", (event) => {
    event.preventDefault()
})

function deleteReview(reviewId, parent, reviewRow) {
    let divReviewEditOtherError = document.getElementById("reviewEditOtherError")
    if(!reviewId) {
        divReviewEditOtherError.classList.remove("d-none")
        divReviewEditOtherError.innerText = "Invalid operation"
    } else if(reviewId.length === 0) {
        divReviewEditOtherError.classList.remove("d-none")
        divReviewEditOtherError.innerText = "Invalid operation"
    } else {
        divReviewEditOtherError.classList.add("d-none")
    }

    $.ajax({
        url: `/myreviews/${reviewId}`,
        type: "DELETE",
        contentType:'application/json',
        dataType: 'json',
        success: function (data) {
            $("#reviewEditDialog").modal("hide")
            parent.removeChild(reviewRow)
        },
        error: function (data) {
            let errors = JSON.parse(data.responseText)

            if(errors.other) {
                divReviewEditOtherError.innerText = errors.other
                divReviewEditOtherError.classList.remove("d-none")
            } else {
                divReviewEditOtherError.classList.add("d-none")
            }
        }
    })
}

function updateReview(reviewId, reviewMessage, reviewRow) {
    let divReviewEditOtherError = document.getElementById("reviewEditOtherError")
    if(!reviewId) {
        divReviewEditOtherError.classList.remove("d-none")
        divReviewEditOtherError.innerText = "Invalid operation"
    } else if(reviewId.length === 0) {
        divReviewEditOtherError.classList.remove("d-none")
        divReviewEditOtherError.innerText = "Invalid operation"
    } else {
        divReviewEditOtherError.classList.add("d-none")
    }

    let data = {
        message: reviewMessage
    }
    $.ajax({
        url: `/myreviews/${reviewId}`,
        type: "PUT",
        contentType:'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function (data) {
            $("#reviewEditDialog").modal("hide")
            reviewRow.children[0].innerText = reviewMessage
        },
        error: function (data) {
            let errors = JSON.parse(data.responseText)

            if(errors.other) {
                divReviewEditOtherError.innerText = errors.other
                divReviewEditOtherError.classList.remove("d-none")
            } else {
                divReviewEditOtherError.classList.add("d-none")
            }
        }
    })
}