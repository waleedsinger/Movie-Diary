const apiKey = "434cdc6115c1cdc4355e3178cc63535a";
const gridSection = document.getElementById("grid-section");
const cardContainer = document.getElementById("card-container");

const storageKey = "favoriteMovies";
const favoritesArray = JSON.parse(localStorage.getItem(storageKey));

// if favorites empty
if (!favoritesArray)
  gridSection.textContent = "Select your favorites on the Movies page";

async function fetchById(movieId) {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US'`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching movie", error);
  }
}

favoritesArray.forEach((element) => {
  fetchById(element.id).then((movieObject) =>
    cardContainer.appendChild(createMovieCard(movieObject))
  );
});

// Creates the Journal Movie Card
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
  cardFavBtn.style =
    "background-image: url('./resources/icons8-stern-48-full.png')";

  // TODO: clicking on it deletes it right away from the journal page
  // Remove from journal when clicked
  cardFavBtn.addEventListener("click", () => {
    removeFromFavorites(movieObject.id);
    cardContainer.remove(); // Remove the card from the DOM
  });

  const cardImg = document.createElement("img");
  cardImg.classList.add("max-w-72", "object-scale-down");
  cardImg.src = `https://image.tmdb.org/t/p/w500/${movieObject.poster_path}`;
  cardImg.alt = `Image of ${movieObject.title}`;

  const cardDetails = document.createElement("div");
  cardDetails.classList.add("p-4", "text-center");

  const cardHeader = document.createElement("h3");
  cardHeader.classList.add(
    "mb-2",
    "font-semibold",
    "text-lg",
    "text-indigo-300",
    "text-left"
  );
  cardHeader.textContent = movieObject.title;

  // Note elements
  const cardNotes = document.createElement("p");
  cardNotes.classList.add("mb-4", "text-indigo-200", "text-sm", "mt-6");
  cardNotes.id = `notes-${movieObject.id}`;

  const cardBtnAddNote = document.createElement("button");
  cardBtnAddNote.classList =
    "bg-indigo-800 text-indigo-200 px-4 py-2 rounded hover:bg-indigo-600 mt-2 mx-auto place-self-center self-center";
  cardBtnAddNote.textContent = "Add Note";

  cardBtnAddNote.addEventListener("click", (e) => {
    addNotePrompt(movieObject.id);
  });

  cardDetails.appendChild(cardHeader);
  cardDetails.appendChild(cardBtnAddNote);
  cardDetails.appendChild(cardNotes);

  cardContainer.appendChild(cardFavBtn);
  cardContainer.appendChild(cardImg);
  cardContainer.appendChild(cardDetails);

  return cardContainer;
}

// Handle adding notes
// TODO (for journal page): notes saved to corressponding movie in favorie list stored in localStorage
function addNotePrompt(movieId) {
  const note = prompt("Add a note for this movie:");
  if (note) {
    const notes = document.getElementById(`notes-${movieId}`);
    notes.textContent = note;
  }
}

function removeFromFavorites(movieId) {
  favoritesArray.splice(
    favoritesArray.findIndex((movie) => movie.id == movieId),
    1
  );
  localStorage.setItem(storageKey, JSON.stringify(favoritesArray));
}
