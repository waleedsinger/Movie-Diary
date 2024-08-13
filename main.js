const apiKey = '434cdc6115c1cdc4355e3178cc63535a'; // Replace with your TMDB API key
const cardContainer = document.getElementById('card-container');
const searchInput = document.getElementById('default-search');
const searchButton = document.querySelector('button[type="submit"]');
const favoriteKey = 'favoriteMovies'; // Key for localStorage

// Fetch movies from TMDB API
async function fetchMovies(query = '') {
    try {
        const url = query
            ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1`
            : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Display movies in the card container
function displayMovies(movies) {
    cardContainer.innerHTML = movies.map(movie => `
        <div id="movie-${movie.id}" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
            <button class="absolute top-2 right-2 text-yellow-400 p-2 hover:text-yellow-500" title="Add to Favourites" onclick="addToFavorites('${movie.id}')">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
            <img class="w-full h-48 object-cover" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${movie.title}</h3>
                <p class="text-gray-400 mb-4">${movie.overview.substring(0, 100)}...</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="addNotePrompt('${movie.id}')">Add Note</button>
                <div id="notes-${movie.id}" class="mt-2 text-gray-300"></div>
            </div>
        </div>
    `).join('');
}

// Handle search button click
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Handle adding notes
function addNotePrompt(movieId) {
    const note = prompt('Add a note for this movie:');
    if (note) {
        const notesDiv = document.getElementById(`notes-${movieId}`);
        const noteElement = document.createElement('p');
        noteElement.textContent = note;
        noteElement.className = 'p-1 bg-gray-700 rounded mb-1'; // Added styles for note visibility
        notesDiv.appendChild(noteElement);
    }
}

// Handle adding to favorites
function addToFavorites(movieId) {
    const movieCard = document.getElementById(`movie-${movieId}`);
    if (movieCard) {
        const movieData = {
            id: movieId,
            html: movieCard.outerHTML
        };
        
        let favorites = JSON.parse(localStorage.getItem(favoriteKey)) || [];
        if (!favorites.find(fav => fav.id === movieId)) {
            favorites.push(movieData);
            localStorage.setItem(favoriteKey, JSON.stringify(favorites));
            alert('Movie added to favorites!');
        } else {
            alert('Movie is already in favorites.');
        }
    }
}

// Initialize by fetching popular movies
fetchMovies();