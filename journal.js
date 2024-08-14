const apiKey = "434cdc6115c1cdc4355e3178cc63535a";
const gridSection = document.getElementById("grid-section");

const storageKey = "favoriteMovies"; //
const favoritesArray = JSON.parse(localStorage.getItem(storageKey))

if (!favoritesArray) gridSection.textContent = "Select your favorites on the Movies page";

async function fetchById(movieId) {
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US'`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
    //   console.log(data);
      return data;
  
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  fetchById();