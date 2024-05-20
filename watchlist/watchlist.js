import { clerk } from "../main";

// console.log(clerk.user);
const mainDiv = document.getElementById("main-div");
const moviesDiv = document.getElementById("movies-div");
const emptyMovie = document.getElementById("no-movie-div");
let watchListArr = JSON.parse(localStorage.getItem("movieIDArr"));

async function getMovieInfo(moviesArr) {
  mainDiv.classList.remove("no-movies");
  emptyMovie.style.display = "none";
  moviesDiv.style.display = "flex";

  const finalMoviesArr = await Promise.all(
    moviesArr.map(async (movieID) => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=1cb41e41&i=${movieID}&plot=short`
      );
      const data = await res.json();
      return data;
    })
  );
  updateHTML(finalMoviesArr);
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
            <p class="add-to-watchlist" tabindex="0" data-movie-id-delete="${
              movie.imdbID
            }">
              <i class="fa-solid fa-trash fa-sm" data-movie-id-delete="${
                movie.imdbID
              }"></i>
              Delete
            </p>
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
  moviesDiv.innerHTML = html;
}

document.addEventListener("click", (e) => {
  const movieIdDelete = e.target.dataset.movieIdDelete;

  if (movieIdDelete) {
    let watchListArr = JSON.parse(localStorage.getItem("movieIDArr"));

    let indexToDelete = watchListArr.indexOf(movieIdDelete);

    if (indexToDelete !== -1) {
      watchListArr.splice(indexToDelete, 1);
    }

    if (watchListArr.length === 0) {
      mainDiv.classList.add("no-movies");
      emptyMovie.style.display = "block";
      moviesDiv.style.display = "none";
      localStorage.removeItem("movieIDArr");
    } else {
      const movieDiv = e.target.parentNode.parentNode.parentNode.parentNode;
      const hrEl = movieDiv.nextElementSibling;

      if (hrEl) {
        hrEl.style.display = "none";
      }

      movieDiv.style.display = "none";
      watchListArr = JSON.stringify(watchListArr);
      localStorage.setItem("movieIDArr", watchListArr);
    }
  }
});

if (watchListArr) {
  getMovieInfo(watchListArr);
}
