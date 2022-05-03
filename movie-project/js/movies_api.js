'use strict';
const BASE = 'https://windy-brawny-lumber.glitch.me/movies'

// Gets an array of objects from the server
const getAllMovies = function (sortBy = 'Title') {
    $.get(BASE, function () {
    }).done(function (movies) {
        // Clears the current movie list
        $(`#movie-insert`).html('');

        // Uses the return of customSort and loop through the results to post the html
        customSort(movies, sortBy).forEach(function (movie) {
            // If the movie title is undefined, delete the movie
            if (movie.title === undefined || movie.title === "") {
                deleteMovie(movie.id);
                getAllMovies();
            }
            const HTML = creatingHtml(movie.poster, movie.title, movie.id);
            $(`#movie-insert`).append(HTML);
        })
    })
}
getAllMovies()

// Gets data for one movie based on the id passed in
const getSelectedMovie = function (id) {
    $.get(`${BASE}/${id}`).done((results) => {
        const ACTORS = results.actors;
        const DATE_RELEASED = results.dateReleased;
        const DIRECTOR = results.director;
        const GENRE = results.genre;
        const IMDB_RATING = results.imdb;
        const PLOT = results.plot;
        const POSTER = results.poster;
        const MOVIE_RATING = results.rating;
        const RUNTIME = results.runtime;
        const TITLE = results.title;
        const YEAR = results.year;
        const ID = results.id;

        $('#movie-info')
            .html(singleMovieModal(ACTORS, DATE_RELEASED, DIRECTOR, GENRE, IMDB_RATING, PLOT, POSTER, MOVIE_RATING, RUNTIME, TITLE, YEAR, ID))
            .removeClass('hidden')
        $overlay.removeClass('hidden')
    })
}

// Adds the movie to the database
const addMovie = function (newMovie) {
    $.post(BASE, newMovie).done(function (){
        getAllMovies('Title')
    })
}

// Calls the addMovie function based on the results of the title being added
const getMovieData = function (title) {
    let structuredTitle = title.split(' ').join('+')
    $.get(`http://www.omdbapi.com/?apikey=${OMBD_KEY}&t=${structuredTitle}`, function (movie, _, jqXHR) {
        const {Error} = jqXHR.responseJSON
        if (Error === "Movie not found!") {
            alert("Movie not found. Please enter a correct title.");
            return;
        }
        console.table(movie)
        console.table(movie.rating)
        const newMovie = {
            title: movie.Title,
            director: movie.Director,
            poster: movie.Poster,
            dateReleased: movie.Released,
            genre: movie.Genre,
            plot: movie.Plot,
            rating: movie.Rated,
            imdb: movie.imdbRating,
            runtime: movie.Runtime,
            actors: movie.Actors,
            year: movie.Year,
        }
        addMovie(newMovie);
        $createMovieForm.addClass('hidden');
        $overlay.addClass('hidden')
        $('#title').val('')
    })
}

//Deletes movie from database
const deleteMovie = function (id) {
    $.ajax({url: `${BASE}/${id}`, type: 'DELETE',}).done( _ => {
        getAllMovies()
        closeModal()
    })
}

// Edits the current movie passed in by id and movie data
const editRequest = function (id, editedData) {
    $.ajax({
        url: `${BASE}/${id}`,
        type: 'PATCh',
        data: editedData,
    }).done(getAllMovies)
}

