const bookTitle = document.getElementById('bookTitle')
const bookCover = document.getElementById('bookCover')
const previewLink = document.getElementById('previewLink').textContent
const reviewTextArea = document.getElementById('reviewTextArea')
const form = document.querySelector('form')


if (previewLink) {
    bookTitle.style.cursor = 'pointer'
    bookCover.style.cursor = 'pointer'

    function goToPreviewPage(previewLink) {
        window.open(previewLink, '_blank');
    }

    bookCover.addEventListener('click', function() {
        goToPreviewPage(previewLink)
    });
    bookTitle.addEventListener('click', function() {
        goToPreviewPage(previewLink)
    });
}

// check if there is stored text for the textarea and restore it if there is
if (localStorage.getItem('reviewText')) {
    reviewTextArea.value = localStorage.getItem('reviewText');
}

// add an event listener to the textarea to store its contents in storage whenever it changes
reviewTextArea.addEventListener('input', () => {
    localStorage.setItem('reviewText', reviewTextArea.value);
});


// Get the form and review container elements
const reviewContainer = document.querySelector('.right-column');

// Add an event listener to the form submit button
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get the book ID from the hidden input field
    const bookId = document.querySelector('#bookId').textContent;

    // Get the review text from the textarea
    const reviewTextArea = document.querySelector('#reviewTextArea');
    const reviewText = reviewTextArea.value;

    // Send a POST request to the server with the review data
    axios.post(`/bookinfo/${bookId}/reviews?fromAxios=true`, { review: reviewText})
        .then(response => {
            if (response.data.redirect) {
                window.location.href = response.data.redirect
            }
            // Create a new review element and add it to the DOM
            let newReview = response.data.reviews[response.data.reviews.length - 1]
            createReviewElement(newReview);

            // Reset the form
            form.reset();

            // Remove review from storage
            localStorage.removeItem('reviewText');
        })
        .catch(error => {
            console.error(error);
        });
});

// Helper function to create a new review element
function createReviewElement(reviewData) {
    // Get a reference to the parent element that contains the reviews
    const reviewsContainer = document.querySelector('.reviews-container');

    // Create a new review element
    const newReviewElement = document.createElement('div');
    newReviewElement.classList.add('grid-box', 'p-3', 'mb-3');
    newReviewElement.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    newReviewElement.style.border = '1px solid #ccc';
    newReviewElement.innerHTML = `
  <p class="text-justify text-dark">${reviewData.review}</p>
  <p class="text-muted">Reviewer: ${reviewData.userThatPostedReview}</p>
`;


    // Append the new review element to the parent element
    reviewsContainer.appendChild(newReviewElement);
}
