const apiKey = "434cdc6115c1cdc4355e3178cc63535a";
const cardContainer = document.getElementById("card-container");
const searchInput = document.getElementById("default-search");
const searchButton = document.querySelector('button[type="submit"]');
const storageKey = "favoriteMovies"; //

const favoritesArray = JSON.parse(localStorage.getItem(storageKey)) || [];

// Fetch movies from TMDB API
async function fetchMovies(query = "") {
  try {
    const url = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data.results);

    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Display movies in the card container
// TODO: clean up: innerHTML should be replaced by createElements(..) methods; yellow heart button not color filled when not set as favorite;
// notes button appear only on journal page
// TODO: restructuring the displayMovies function, so that this function calls the fetchMovies function
function displayMovies(movies) {
  movies.map((element) => {
    cardContainer.appendChild(createMovieCard(element));
  });

  //   cardContainer.innerHTML = movies
  //     .map(
  //       (movie) => `
  //         <div id="movie-${
  //           movie.id
  //         }" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
  //             <button class="absolute top-2 right-2 text-yellow-400 p-2 hover:text-yellow-500" title="Add to Favourites" onclick="addToFavorites('${
  //               movie.id
  //             }')">
  //                 <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  //                 </svg>
  //             </button>
  //             <img class="w-full h-48 object-cover" src="https://image.tmdb.org/t/p/w500/${
  //               movie.poster_path
  //             }" alt="${movie.title}">
  //             <div class="p-4">
  //                 <h3 class="text-xl font-semibold mb-2">${movie.title}</h3>
  //                 <p class="text-gray-400 mb-4">${movie.overview.substring(
  //                   0,
  //                   100
  //                 )}...</p>
  //                 <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="addNotePrompt('${
  //                   movie.id
  //                 }')">Add Note</button>
  //                 <div id="notes-${movie.id}" class="mt-2 text-gray-300"></div>
  //             </div>
  //         </div>
  //     `
  //     )
  //     .join("");
}

function createMovieCard(movieObject) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "bg-gray-800",
    "rounded-lg",
    "overflow-hidden",
    "shadow-lg",
    "relative"
  );
  cardContainer.id = movieObject.id;

  const cardFavBtn = document.createElement("button");
  cardFavBtn.className =
    "absolute fill-current top-2 right-0.5 text-yellow-400 p-6 hover:text-yellow-500";
  cardFavBtn.style = "background-image: url('./resources/icons8-stern-48.png')"

//   cardFavBtn.textContent = `<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
// </svg>`;
  cardFavBtn.addEventListener("click", (e) => {
    addToFavorites(movieObject);
    cardFavBtn.style = "background-image: url('./resources/icons8-stern-48-full.png')"
  });

  cardFavBtn.addEventListener("mouseover", (e) => {
    cardFavBtn.style = "background-image: url('./resources/icons8-stern-48-full.png')"
  });

  cardFavBtn.addEventListener("mouseout", (e) => {
    cardFavBtn.style = "background-image: url('./resources/icons8-stern-48.png')"
  });

  const cardImg = document.createElement("img");
  cardImg.classList.add("w-full", "h-52", "object-scale-down");
  cardImg.src = `https://image.tmdb.org/t/p/w500/${movieObject.poster_path}`;
  cardImg.alt = `Image of ${movieObject.title}`;

  const cardDetails = document.createElement("div");
  cardDetails.classList.add("p-4");

  const cardHeader = document.createElement("h3");
  cardHeader.classList.add(
    "mb-2",
    "font-semibold",
    "text-xl",
    "text-indigo-300"
  );
  cardHeader.textContent = movieObject.title;

  const cardOverview = document.createElement("p");
  cardOverview.classList.add("mb-4", "text-indigo-200");
  cardOverview.textContent = movieObject.overview.substring(0, 100);

  cardDetails.appendChild(cardHeader);
  cardDetails.appendChild(cardOverview);

  cardContainer.appendChild(cardFavBtn);
  cardContainer.appendChild(cardImg);
  cardContainer.appendChild(cardDetails);

  return cardContainer;
}

// Handle search button click
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

// Handle adding notes
// TODO (for journal page): notes saved to corressponding movie in favorie list stored in localStorage
function addNotePrompt(movieId) {
  const note = prompt("Add a note for this movie:");
  if (note) {
    const notesDiv = document.getElementById(`notes-${movieId}`);
    const noteElement = document.createElement("p");
    noteElement.textContent = note;
    noteElement.className = "p-1 bg-gray-700 rounded mb-1"; // Added styles for note visibility
    notesDiv.appendChild(noteElement);
  }
}

// Handle adding to favorites
// TODO: heart icon changes to a yellow filled heart
// TODO: movieData that is stored should be an object consisting of the title and an unique id (the one that is already in the DB?)
function addToFavorites(movieObject) {
  const movieFav = {
    title: movieObject.title,
    id: movieObject.id,
  };
  if (!favoritesArray.find((fav) => fav.id === movieObject.id)) {
    favoritesArray.push(movieFav);
    localStorage.setItem(storageKey, JSON.stringify(favoritesArray));
    alert("Movie added to favorites!");
  } else {
    alert("Movie is already in favorites.");
  }
}

// Initialize by fetching popular movies
fetchMovies();
