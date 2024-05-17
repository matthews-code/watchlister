import "./style.css";
import { Clerk } from "@clerk/clerk-js";
import {
  dark,
  experimental__simple,
  experimental_createTheme,
  neobrutalism,
  shadesOfPurple,
} from "@clerk/themes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const clerk = new Clerk(clerkPubKey);

const authDiv = document.getElementById("auth-div");
const mainSection = document.getElementById("main-section");
const movieInput = document.getElementById("movies-input");
const searchBtn = document.getElementById("search-button");
const mainDiv = document.getElementById("main-div");
const emptyMovie = document.getElementById("no-movie-div");
const moviesDiv = document.getElementById("movies-div");

const moviePlaceholder = [
  {
    Actors: "Robert Downey Jr., Chris Evans, Scarlett Johansson",
    Awards: "Nominated for 1 Oscar. 39 wins & 81 nominations total",
    BoxOffice: "$623,357,910",
    Country: "United States",
    DVD: "22 Jun 2014",
    Director: "Joss Whedon",
    Genre: "Action, Sci-Fi",
    Language: "English, Russian",
    Metascore: "69",
    Plot: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    Production: "N/A",
    Rated: "PG-13",
    Released: "04 May 2012",
    Response: "True",
    Runtime: "143 min",
    Title: "The Avengers: Age of Ultron Age of Ultron",
    Type: "movie",
    Website: "N/A",
    Writer: "Joss Whedon, Zak Penn",
    Year: "2012",
    imdbID: "tt0848228",
    imdbRating: "8.0",
    imdbVotes: "1,457,886",
  },
];

await clerk.load({
  // appearance: {
  //   baseTheme: neobrutalism,
  // },
});

if (clerk.user) {
  if (mainSection) mainSection.style.display = "flex";
  if (authDiv) authDiv.style.display = "none";

  document.getElementById("user-button-div").innerHTML = `
    <div id="user-button"></div>
  `;

  const userButtonDiv = document.getElementById("user-button");

  clerk.mountUserButton(userButtonDiv);
} else {
  if (mainSection) mainSection.style.display = "none";
  authDiv.innerHTML = `
    <div id="sign-in"></div>
  `;

  const signInDiv = document.getElementById("sign-in");

  clerk.mountSignIn(signInDiv);
}

searchBtn.addEventListener("click", () => {
  if (movieInput.value) {
    searchMovie(movieInput.value);
    // mainDiv.classList.remove("no-movies");
    // emptyMovie.style.display = "none";
    // moviesDiv.style.display = "flex";
    // updateHTML(moviePlaceholder);
  }
});

async function searchMovie(title) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=1cb41e41&s=${title}`
  );
  const data = await res.json();

  mainDiv.classList.remove("no-movies");
  emptyMovie.style.display = "none";
  moviesDiv.style.display = "flex";

  getMovieInfo(data.Search);
}

async function getMovieInfo(moviesArr) {
  const finalMoviesArr = await Promise.all(
    moviesArr.map(async (movie) => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=1cb41e41&i=${movie.imdbID}&plot=short`
      );
      const data = await res.json();
      return data;
    })
  );

  updateHTML(finalMoviesArr);
}

function updateHTML(movies) {
  console.log(movies);
  let html = "";
  movies.forEach((movie) => {
    html += `
    <div class="indiv-movie">
      <img
        class="movie-poster"
        src="${movie.Poster}"
        alt="Movie poster for ${movie.Title}"
      />
      <div class="movie-info-div">
        <div class="movie-title">
          <h2>${movie.Title + "&nbsp;&nbsp;"} 
            <span style="color: #ffd254">
              <i class="fa-solid fa-star"></i>
            </span>
            ${movie.imdbRating}
          </h2>
        </div>
        <div class="movie-subinfo">
          <p>${movie.Runtime}</p>
          <p>${movie.Genre}</p>
          <div>
            <p class="add-to-watchlist" tabindex="0">
              <i class="fa-solid fa-circle-plus fa-lg"></i>
              Watchlist
            </p>
          </div>
        </div>
        <p class="movie-desc">
          ${movie.Plot}
        </p>
      </div>
    </div>
    <hr />
    `;
  });
  moviesDiv.innerHTML = html;
}
