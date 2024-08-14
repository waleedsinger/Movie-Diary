const apiKey = "434cdc6115c1cdc4355e3178cc63535a";
const cardContainer = document.getElementById("card-container");
const searchInput = document.getElementById("default-search");
const searchButton = document.querySelector('button[type="submit"]');
const storageKey = "favoriteMovies"; //

const favoritesArray = JSON.parse(localStorage.getItem(storageKey)) || [];

// Fetch movies from TMDB API; empty search leads back to popular movies
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

    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Display movies in the card container
function displayMovies(movies) {
  // Clearing cardContainer from previous items shown (elsewise it will just append the items searched for)
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }

  movies.map((element) => {
    cardContainer.appendChild(createMovieCard(element));
  });
}

// Creates the Movie Card
function createMovieCard(movieObject) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "bg-gray-800",
    "rounded-lg",
    "overflow-hidden",
    "shadow-lg",
    "relative",
    "max-w-72"
  );
  cardContainer.id = movieObject.id;

  const cardFavBtn = document.createElement("button");
  cardFavBtn.className =
    "absolute fill-current top-2 right-0.5 text-yellow-400 p-6 hover:text-yellow-500";

  if (!favoritesArray.find((fav) => fav.id === movieObject.id)) {
    cardFavBtn.style =
      "background-image: url('./resources/icons8-stern-48.png')";
  } else
    cardFavBtn.style =
      "background-image: url('./resources/icons8-stern-48-full.png')";

  cardFavBtn.addEventListener("click", (e) => {
    addToFavorites(movieObject);
    cardFavBtn.style =
      "background-image: url('./resources/icons8-stern-48-full.png')";
  });

  cardFavBtn.addEventListener("mouseover", (e) => {
    cardFavBtn.style =
      "background-image: url('./resources/icons8-stern-48-full.png')";
  });

  cardFavBtn.addEventListener("mouseout", (e) => {
    if (!favoritesArray.find((fav) => fav.id === movieObject.id))
      cardFavBtn.style =
        "background-image: url('./resources/icons8-stern-48.png')";
  });

  const cardImg = document.createElement("img");
  cardImg.classList.add("max-w-72", "object-scale-down");
  cardImg.src = `https://image.tmdb.org/t/p/w500/${movieObject.poster_path}`;
  cardImg.alt = `Image of ${movieObject.title}`;

  const cardDetails = document.createElement("div");
  cardDetails.classList.add("p-4");

  const cardHeader = document.createElement("h3");
  cardHeader.classList.add(
    "mb-2",
    "font-semibold",
    "text-lg",
    "text-indigo-300"
  );
  cardHeader.textContent = movieObject.title;

  const cardOverview = document.createElement("p");
  cardOverview.classList.add("mb-4", "text-indigo-200", "text-sm", "mt-6");
  // cardOverview.textContent = movieObject.overview;
  movieObject.overview.length > 150
    ? (cardOverview.textContent =
        movieObject.overview.substring(0, 150) + "...")
    : (cardOverview.textContent = movieObject.overview);

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
  fetchMovies(query);
});

// Handle adding to favorites
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
    // Remove from storage when clicked
    // Confirm before deletion
    if (
      confirm(
        `Should the movie \"${movieObject.title}\" really removed from your favorites?`
      )
    ) {
      removeFromFavorites(movieObject.id);
    }
  }
}

function removeFromFavorites(movieId) {
  favoritesArray.splice(
    favoritesArray.findIndex((movie) => movie.id == movieId),
    1
  );
  localStorage.setItem(storageKey, JSON.stringify(favoritesArray));
}

// Initialize by fetching popular movies
fetchMovies();
