"use strict;"
// Declaring global variables for elements that are targeted more than once
const $createMovieForm = $('.create-movie-form');
const $movieInfo = $('#movie-info');
const $overlay = $('.overlay');
const $editMovieSection = $('.edit-movie-section');

const $editTitleInput = $('#editTitle');
const $editYearInput = $('#editYear');
const $editGenreInput = $('#editGenre');

// Creates main html for page
const creatingHtml = function (imgSrc, title, id) {
    //language=HTML
    return `
        <div id="movie" class="movie-container">
            <div>
                <img src="${imgSrc}" alt="Movie Poster" data-id="${id}">
                <p>${title}</p>
            </div>
        </div>`
}

// Configures IMDB Rating
const setIMDBRating = function (imdbRating) {
    if (imdbRating === "N/A") {
        return 'NR'
    } else {
        return `${imdbRating}/10`
    }
}

// Creates the html for modal after image is clicked
const singleMovieModal = function (actors, date, director, genre, imdb, plot, poster, rating, runtime, title, year, id) {
    //language=HTML
    return `
        <div id="movie-info-insert" data-id="${id}">
            <img src="${poster}" alt="${title} Movie Poster" id="single-image">
            <div id="main-movie-info">
                <h2>${title}<span>(${year})</span></h2>
                <div class="facts">${rating}<span>${date}</span><span
                        id="single-genre">${genre}</span><span>${runtime}</span></div>
                <div id="ratings"><span>${setIMDBRating(imdb)}</span> IMDB<span></div>
                <div>${plot}</div>
                <div>Actors - ${actors}</div>
                <span>Director - ${director}</span>
                <div id="links">
                    <a href="" id="edit">Edit</a>
                    <a href="" id="delete">Delete</a>
                </div>
            </div>`
}

// Closes all modals
const closeModal = function () {
    $createMovieForm.addClass('hidden');
    $movieInfo.addClass('hidden');
    $editMovieSection.addClass('hidden');
    $overlay.addClass('hidden');
}

// Sets the values for the edit modal
const editFormFill = function () {
    let [title, year] = $('#main-movie-info h2').text().split('(')
    let genre = $('#single-genre').text()
    $editTitleInput.val(title);
    $editYearInput.val(parseInt(year));
    $editGenreInput.val(genre);
    $editMovieSection.removeClass('hidden');
    $movieInfo.addClass('hidden');
}

// Pass in the edited values to update the database when clicked
const editMovie = function (event) {
    event.preventDefault();
    const movieID = $('#movie-info-insert').attr('data-id');
    editRequest(movieID, getEditData());
    $editMovieSection.addClass('hidden');
    $overlay.addClass('hidden')
}

// Checks to see which link is clicked on the single movie info modal
// calls either the edit or delete functions based on the target
const editOrDelete = function (e) {
    e.preventDefault();
    console.log(e.target)
    if (e.target.getAttribute('id') === 'edit') {
        editFormFill();
    }
    if (e.target.getAttribute('id') === 'delete') {
        deleteMovie($('#movie-info').children().attr('data-id'));
    }
}
// Returns the values to patch the movie
const getEditData = function (){
    return {
        title: $editTitleInput.val(),
        year: $editYearInput.val(),
        genre: $editGenreInput.val()
    }
}

// Custom sort and filter for the movies results
const customSort = function(movieData, sortBy) {
    if (sortBy === 'Title'){
        return movieData.sort((prevMovie, currMovie) => prevMovie.title.localeCompare(currMovie.title));
    } else if (sortBy === "Rating"){
        return movieData.sort((prevMovie, currMovie) => prevMovie.rating.localeCompare(currMovie.rating));
    } else if (sortBy === "Action" || sortBy === "Adventure" || sortBy === "Comedy" || sortBy === "Drama" || sortBy === "Fantasy" || sortBy === "Horror" || sortBy === "Mystery" || sortBy === "Romance" || sortBy === "Thriller" || sortBy === "War" || sortBy === "Western") {
        return movieData.filter(movie => movie.genre.includes(sortBy))
            .sort((prevMovie, currMovie) => prevMovie.title.localeCompare(currMovie.title));
    } else {
        return movieData;
    }
}
