import {env} from './env.js'


let movieList = [];
let watchList = [];


document.getElementById('toWatch').style.display = "none";
document.body.addEventListener('load', fetchMovies());
document.getElementById('watchList').addEventListener('click', printWatchlist);
env.printer();


function fetchMovies(){
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=' + env.apiKey)
    .then((res) => {
        return res.json(); 
    })
    .then((data) => {   
        const movies = data.results;
        movies.forEach(element => {
            let movieTitle;
            if(element.name==undefined){
            movieTitle = element.original_title;
            }
            else{
            movieTitle = element.name;
            }

            movieList.push({
                name: movieTitle, 
                description: element.overview, 
                poster: element.poster_path,
                movieID: element.id, 
                rating: element.vote_average, 
                mediaType: element.media_type
            });

        });
        return movieList;

    })
    .then(
        printTrendingMovies
    )
    .catch((error) => {
        console.error(error);
    });
}

function printTrendingMovies(){

    document.getElementById('output').style.display = "block";
    document.getElementById('loading').style.display = "none";
    let output1 = '';
    let popcorn = "./Popcorn_Time_logo.png";
    let youtube = "./youtube.png"; 

    for (let index = 0; index < movieList.length; index++) {
        let imgsrc = "https://image.tmdb.org/t/p/original";
        
        output1 += 
        `<div class='container'>
        <h3> ${movieList[index].name} </h3>
        <img class="poster" src="${imgsrc}${movieList[index].poster}">  
        <div>
        <button data-action="watchlist" data-content=${movieList[index].movieID}> Add to Watchlist </button>
        </div>
        <div class="userInterface">
        <img class="youtube" data-action="trailer" data-content=${movieList[index].movieID}-${movieList[index].mediaType} src=${youtube}>`;
        
        if(movieList[index].rating>=7.0){
            output1 += `<img class="watchable" src="${popcorn}">`
        }
        
        output1 +=
        `</div>
        </div>`;
        
        document.getElementById('output').innerHTML = output1;

        const watchListButtons = document.querySelectorAll('[data-action="watchlist"]');
        const trailerButtons = document.querySelectorAll('[data-action="trailer"]');

        
        watchListButtons.forEach(watchListButton => {
            watchListButton.addEventListener('click', event => {

                const movieId = event.target.getAttribute('data-content')
                getMovieId(movieList.find(movie=> movie.movieID === Number(movieId)))
        })
        })

        trailerButtons.forEach(trailerButton => {
            trailerButton.addEventListener('click', event => {
                const movie = event.target.getAttribute('data-content').split('-')
                getTrailer(movie[0], movie[1])
        })
        })
    }
}

function getMovieId(movie){

    watchList.push(movie);
    let htmlp = document.createElement('li');
    let imgsrc = "https://image.tmdb.org/t/p/original" 

    for (let index = 0; index < watchList.length; index++) {
        var rating = watchList[index].rating;
        var rounded = Math.round(rating * 10) / 10
        let newimage = imgsrc+watchList[index].poster;
        htmlp.innerHTML=`<li id="${watchList[index].name}">
        <h2>${watchList[index].name}</h3>
        <div class="watchlistItems" >
        <div>
        <img class="watchlistPoster" src=${newimage}>
        </div class="watchableContainer">
        <div class="description">
        <p>${watchList[index].description}</p>
        <div class="circle">${rounded}</div>
        
        <br>
        <button data-action="delete" id="${watchList[index].name}">delete</button>
        <div>
        </div>
        </div>
        </div>
        </li>`;} 
        
        
    document.getElementById('content').append(htmlp);

    const deleteButton = document.querySelectorAll('[data-action="delete"]');

        
    deleteButton.forEach(deleteButton => {
            deleteButton.addEventListener('click', event => {
                const movieId = event.target.getAttribute('id')
                deleteFromWatchList(movieId)})
        })

}

function printWatchlist() {

    document.getElementById('toWatch').style.display = "block";
    document.getElementById('output').style.display = "none";
    document.getElementById('watchList').style.display = "none";
    document.getElementById('close').addEventListener('click', ()=>
    {
        document.getElementById('toWatch').style.display="none";
        document.getElementById('output').style.display="block";
        document.getElementById('watchList').style.display = "inline-block";
    });
}

function deleteFromWatchList(movieId) {
    const element = document.getElementById(movieId);
    const indexer = watchList.findIndex(rank => rank.name === movieId);
    watchList.splice(indexer, 1);
    element.remove();
}

function getTrailer(movieTrailer, media){
    let trailerurl;
    let youtubeUrl;
    if (media === "movie"){
        trailerurl = "https://api.themoviedb.org/3/movie/"+movieTrailer+"/videos?api_key=224b2d4d126146f47deb3fdaeec5826b&language=en-US";
    }
    else if (media === "tv"){
        trailerurl =  "https://api.themoviedb.org/3/tv/"+movieTrailer+"/videos?api_key=224b2d4d126146f47deb3fdaeec5826b&language=en-US";
    }

    youtubeUrl = "https://www.youtube.com/embed/";
    

    fetch(trailerurl).then((response) => {return response.json()}).then((data) => 
    {
        const trailers = data.results;
        trailers.forEach(element => {
            if(element.site == "YouTube" && element.type == "Trailer"){
                youtubeUrl += element.key+"?&autoplay=1";                
                Swal.fire({
                    html:
                    `
                    <div style="padding-bottom:56.25%; position:relative; display:block; width: 100%">
                    <iframe width="100%" height="100%"
                    src="${youtubeUrl}"
                    frameborder="0" allowfullscreen="" style="position:absolute; top:0; left: 0">
                    </iframe>
                    </div>
                    `,

                    showCloseButton: false,
                    showCancelButton: false,
                    focusConfirm: false,
                    width: '1080px',
                })
            }
        });
    });
}

