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
const clerk = new Clerk(clerkPubKey);

const authDiv = document.getElementById("auth-div");
const mainSection = document.getElementById("main-section");
const movieInput = document.getElementById("movies-input");
const searchBtn = document.getElementById("search-button");
const mainDiv = document.getElementById("main-div");
const emptyMovie = document.getElementById("no-movie-div");
const moviesDiv = document.getElementById("movies-div");

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

if (searchBtn)
  searchBtn.addEventListener("click", () => {
    if (movieInput.value) {
      localStorage.setItem("currPage", 1);
      localStorage.setItem("movieInput", movieInput.value);
      document.getElementById("pagination").style.display = "none";
      resetHtml();
      searchMovie(movieInput.value);
    }
  });

movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

if (localStorage.getItem("movieInput") && localStorage.getItem("currPage")) {
  const title = localStorage.getItem("movieInput");
  searchMovie(title);
}

function resetHtml() {
  while (moviesDiv.children.length > 1) {
    moviesDiv.removeChild(moviesDiv.firstChild);
  }
}

async function searchMovie(title) {
  const pageNum = localStorage.getItem("currPage");

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=1cb41e41&s=${title}&page=${pageNum}`
  );
  const data = await res.json();

  if (!data.Error) {
    mainDiv.classList.remove("no-movies");
    emptyMovie.style.display = "none";
    moviesDiv.style.display = "flex";

    localStorage.setItem("totalPages", data.totalResults);

    getMovieInfo(data.Search);
  } else {
    moviesDiv.style.display = "none";
    mainDiv.classList.add("no-movies");
    emptyMovie.style.display = "block";
    emptyMovie.innerHTML = `
      <i class="fa-regular fa-folder-open fa-7x"></i>
      <h2>No movie found</h2>
    `;
  }
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

  setPageDiv();
  updateHTML(finalMoviesArr);
}

function setPageDiv() {
  document.getElementById("pagination").style.display = "flex";
  const currPage = localStorage.getItem("currPage");
  const totalPages = localStorage.getItem("totalPages");
  const pageText = document.getElementById("page-text");

  if (currPage === "1") {
    document.getElementById("prev-btn").setAttribute("disabled", "disabled");
  } else if (currPage === totalPages) {
    document.getElementById("next-btn").setAttribute("disabled", "disabled");
  } else {
    document.getElementById("prev-btn").removeAttribute("disabled");
    document.getElementById("next-btn").removeAttribute("disabled");
  }

  pageText.innerHTML = `${currPage} of ${totalPages}`;
}

function updateHTML(movies) {
  const watchListArr = JSON.parse(localStorage.getItem("movieIDArr"));

  let html = "";
  movies.forEach((movie, index) => {
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
          ${
            watchListArr && watchListArr.includes(movie.imdbID)
              ? `<p style="color: grey;">Added</p>`
              : `<p class="add-to-watchlist" tabindex="0" data-movie-id="${movie.imdbID}">
              <i class="fa-solid fa-circle-plus fa-lg" data-movie-id="${movie.imdbID}"></i>
              Watchlist
            </p>`
          }
          </div>
        </div>
        <p class="movie-desc">
          ${movie.Plot}
        </p>
      </div>
    </div>
    ${index !== movies.length - 1 ? "<hr />" : ""}
    `;
  });

  moviesDiv.innerHTML = html + moviesDiv.innerHTML;
}

function prevSearch() {
  const title = localStorage.getItem("movieInput");
  let page = localStorage.getItem("currPage");

  page = parseInt(page) - 1;
  localStorage.setItem("currPage", page);

  window.scrollTo(0, 0);

  searchMovie(title);
}

function nextSearch() {
  const title = localStorage.getItem("movieInput");
  let page = localStorage.getItem("currPage");

  page = parseInt(page) + 1;
  localStorage.setItem("currPage", page);

  window.scrollTo(0, 0);

  searchMovie(title);
}

document.addEventListener("click", (e) => {
  const movieId = e.target.dataset.movieId;
  const pageId = e.target.dataset.pageId;

  if (movieId) {
    let watchListArr = localStorage.getItem("movieIDArr")
      ? JSON.parse(localStorage.getItem("movieIDArr"))
      : [];
    watchListArr.push(movieId);
    watchListArr = JSON.stringify(watchListArr);
    localStorage.setItem("movieIDArr", watchListArr);

    e.target.parentElement.innerHTML = `<p style="color: grey;">Added</p>`;
  } else if (pageId) {
    resetHtml();
    document.getElementById("pagination").style.display = "none";
    if (pageId === "prev") {
      prevSearch();
    } else {
      nextSearch();
    }
  }
});
