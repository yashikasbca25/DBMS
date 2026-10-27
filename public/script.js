
const form = document.getElementById("movieForm");
const movieTable = document.getElementById("movieTable");
const searchInput = document.getElementById("search");
const message = document.getElementById("message");

const movieId = document.getElementById("movieId");
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const yearInput = document.getElementById("releaseYear");
const ratingInput = document.getElementById("rating");
const watchedInput = document.getElementById("watched");

const formHeading = document.getElementById("formHeading");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

let movies = [];
let searchTimer;

async function api(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}

function showMessage(text) {
    message.textContent = text;
}

function updateStats() {
    document.getElementById("totalCount").textContent =
        movies.length;

    document.getElementById("watchedCount").textContent =
        movies.filter(movie => movie.watched === "Yes").length;

    document.getElementById("unwatchedCount").textContent =
        movies.filter(movie => movie.watched === "No").length;
}

async function loadMovies() {
    try {
        const search = searchInput.value.trim();

        movies = await api(
            `/api/movies?search=${encodeURIComponent(search)}`
        );

        renderMovies();
        updateStats();
    } catch (error) {
        movieTable.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = error.message;

        row.appendChild(cell);
        movieTable.appendChild(row);

        showMessage("Unable to load movies. Check the server.");
    }
}

function renderMovies() {
    movieTable.replaceChildren();

    if (movies.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No movies found.";

        row.appendChild(cell);
        movieTable.appendChild(row);
        return;
    }

    for (const movie of movies) {
        const row = document.createElement("tr");

        const values = [
            movie.movie_id,
            movie.title,
            movie.genre,
            movie.release_year,
            movie.rating ?? "Not rated",
            movie.watched
        ];

        for (const value of values) {
            const cell = document.createElement("td");
            cell.textContent = String(value);
            row.appendChild(cell);
        }

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.addEventListener("click", () => editMovie(movie));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", () => deleteMovie(movie));

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        movieTable.appendChild(row);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const data = {
        title: titleInput.value.trim(),
        genre: genreInput.value.trim(),
        release_year: Number(yearInput.value),
        rating: ratingInput.value === ""
            ? null
            : Number(ratingInput.value),
        watched: watchedInput.value
    };

    try {
        if (movieId.value) {
            await api(`/api/movies/${movieId.value}`, {
                method: "PUT",
                body: JSON.stringify(data)
            });

            showMessage("Movie updated successfully.");
        } else {
            await api("/api/movies", {
                method: "POST",
                body: JSON.stringify(data)
            });

            showMessage("Movie added successfully.");
        }

        resetForm();
        await loadMovies();
    } catch (error) {
        showMessage(error.message);
    }
});

function editMovie(movie) {
    movieId.value = movie.movie_id;
    titleInput.value = movie.title;
    genreInput.value = movie.genre;
    yearInput.value = movie.release_year;
    ratingInput.value = movie.rating ?? "";
    watchedInput.value = movie.watched;

    formHeading.textContent = "Update Movie";
    saveButton.textContent = "Save Changes";
    cancelButton.classList.remove("hidden");

    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
    form.reset();
    movieId.value = "";
    formHeading.textContent = "Add a Movie";
    saveButton.textContent = "Add Movie";
    cancelButton.classList.add("hidden");
}

cancelButton.addEventListener("click", resetForm);

async function deleteMovie(movie) {
    const confirmed = window.confirm(
        `Delete "${movie.title}" from your collection?`
    );

    if (!confirmed) return;

    try {
        await api(`/api/movies/${movie.movie_id}`, {
            method: "DELETE"
        });

        if (movieId.value === String(movie.movie_id)) {
            resetForm();
        }

        showMessage("Movie deleted successfully.");
        await loadMovies();
    } catch (error) {
        showMessage(error.message);
    }
}

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadMovies, 250);
});

loadMovies();
