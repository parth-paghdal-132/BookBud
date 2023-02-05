const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const bookCardTemplate = document.getElementById('book-card-template').innerHTML;

searchButton.addEventListener('click', function() {
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
                    .replace('href=""', `href="/auth/login"`)
                    .replace('<h5 class="card-title"></h5>', `<h5 class="card-title">${book.volumeInfo.title}</h5>`);

                resultsContainer.insertAdjacentHTML('beforeend', bookCard);
            });
        });
});
