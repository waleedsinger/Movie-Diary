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
  fetchById(element.id).then((movieObject) => cardContainer.appendChild(createMovieCard(movieObject)));
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

  // TODO: clicking on it deletes it right away from the journal page
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

  // Note elements
  const cardNotes = document.createElement("p");
  cardNotes.classList.add("mb-4", "text-indigo-200", "text-sm", "mt-6");
  cardNotes.id = `notes-${movieObject.id}`;

  const cardBtnAddNote = document.createElement("button");
  cardBtnAddNote.classList =
    "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600";
  cardBtnAddNote.textContent = "Add Note";

  cardBtnAddNote.addEventListener("click", (e) => {
    addNotePrompt(movieObject.id);
  });

  // Movie Card function....

  //                (additional code for journal page MovieCards):
  //                 <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="addNotePrompt('${
  //                   movie.id
  //                 }')">Add Note</button>
  //                 <div id="notes-${movie.id}" class="mt-2 text-gray-300"></div>

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
    // notesElement.className = "p-1 bg-gray-700 rounded mb-1"; // Added styles for note visibility
  }
}
