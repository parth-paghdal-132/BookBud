const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const bookCardTemplate = document.getElementById('book-card-template').innerHTML;

// Store a flag in sessionStorage indicating that the user has navigated back to the page
if (window.performance && window.performance.navigation.type === 2) {
    sessionStorage.setItem('fromBackButton', true);
} else {
    sessionStorage.removeItem('fromBackButton');
}

// Check for the presence of the flag on page load
window.onload = function() {
    if (sessionStorage.getItem('fromBackButton')) {
        // Code to execute when page is accessed as a result of a back button click
        console.log('hi')
        // Check if there are search results stored in sessionStorage
        const storedResults = sessionStorage.getItem('searchResults');
        if (storedResults) {
            // Parse the stored results from JSON
            const data = JSON.parse(storedResults);

            // Loop through the stored search results and add a book card for each one
            data.items.forEach(book => {
                const bookCard = bookCardTemplate
                    .replace('src=""', `src="${book.volumeInfo.imageLinks.thumbnail}"`)
                    .replace('href=""', `href="/bookinfo/${book.id}"`)
                    .replace('<h5 class="card-title"></h5>', `<h5 class="card-title">${book.volumeInfo.title}</h5>`);

                resultsContainer.insertAdjacentHTML('beforeend', bookCard);
            });
        }
    }
}

function searchFunction() {
    const query = searchInput.value;

    // Send a request to the Google Books API with the user's search query
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            // Clear any previous search results
            resultsContainer.innerHTML = '';

            // Loop through the search results and add a book card for each one
            data.items.forEach(book => {
                const bookCard = bookCardTemplate
                    .replace('src=""', `src="${book.volumeInfo.imageLinks.thumbnail}"`)
                    .replace('href=""', `href="/bookinfo/${book.id}"`)
                    .replace('<h5 class="card-title"></h5>', `<h5 class="card-title">${book.volumeInfo.title}</h5>`);

                resultsContainer.insertAdjacentHTML('beforeend', bookCard);
            });

            // Store the search results in sessionStorage
            sessionStorage.setItem('searchResults', JSON.stringify(data));
        });
}

searchButton.addEventListener('click', function() {
    searchFunction();
});

searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchFunction();
    }
});
