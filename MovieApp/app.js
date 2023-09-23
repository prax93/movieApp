
let movieList = [];
let watchList = [];


document.getElementById('toWatch').style.display = "none";
document.body.addEventListener('load', fetchMovies());
document.getElementById('watchList').addEventListener('click', printWatchlist);
const listFormater = document.querySelector('li');

function fetchMovies(){
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=224b2d4d126146f47deb3fdaeec5826b')
    .then((res) => {
        return res.json(); 
        //document.getElementById('output').style.display = "none";
    })
    .then((data) => {   

        const movies = data.results;

        console.log(movies);

        movies.forEach(element => {
            let movieTitle;
            if(element.name==undefined){
            movieTitle = element.original_title;
            }
            else{
            movieTitle = element.name;
            }

            movieList.push(obj = {
                name: movieTitle, 
                description: element.overview, 
                poster: element.poster_path,
                movieID: element.id, 
                rating: element.vote_average, 
                mediaType: JSON.stringify(element.media_type)
            });

        });

        console.log(movieList);
        return movieList;

    }).then(printTrendingMovies)
    .catch((error) => {
        console.error(error);
    });
}

function printTrendingMovies(){

    document.getElementById('output').style.display = "";
    document.getElementById('loading').style.display = "none";
    let output1 = '';
    popcorn = "./Popcorn_Time_logo.png";
    youtube = "./youtube.png"; 

    for (let index = 0; index < movieList.length; index++) {
        let imgsrc = "https://image.tmdb.org/t/p/original";
        
        output1 += 
        `<div class='container'>
        <h3> ${movieList[index].name} </h3>
        <img class="poster" src="${imgsrc}${movieList[index].poster}">  
        <div>
        <button id=${index} onclick="getMovieId()"> Add to Watchlist </button>
        </div>
        <div class="userInterface">
        <img class="youtube" id=${movieList[index].movieID} onclick=getTrailer(${movieList[index].movieID},${movieList[index].mediaType}) src=${youtube}>`;
        
        if(movieList[index].rating>=7.0){
            output1 += `<img class="watchable" src="${popcorn}">`
        }
        
        output1 +=
        `</div>
        </div>`;
        
        document.getElementById('output').innerHTML = output1;
    }  
}

function getMovieId(){

    watchList.push(movieList[event.target.id]);
    let htmlp = document.createElement('li');
    let imgsrc = "https://image.tmdb.org/t/p/original" 

    for (let index = 0; index < watchList.length; index++) {
        var rating = watchList[index].rating;
        var rounded = Math.round(rating * 10) / 10
        newimage = imgsrc+watchList[index].poster;
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
        <button onclick="deleteFromWatchList()" id="${watchList[index].name}">delete</button>
        <div>
        </div>
        </div>
        </div>
        </li>`;} 
        
        
    document.getElementById('content').append(htmlp);
    
    console.log(watchList);
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

function deleteFromWatchList() {

    
    index = event.target.id;
    const element = document.getElementById(index);
    console.log(index);

  
            
            indexer = watchList.findIndex(rank => rank.name === index);
            console.log(indexer);
            
            watchList.splice(indexer, 1);
            console.log(watchList);

    element.remove(); 

}

function getTrailer(movieTrailer, media){

    if (media == "movie"){

        trailerurl = "https://api.themoviedb.org/3/movie/"+movieTrailer+"/videos?api_key=224b2d4d126146f47deb3fdaeec5826b&language=en-US";
    }
    else if (media == "tv"){
        trailerurl =  "https://api.themoviedb.org/3/tv/"+movieTrailer+"/videos?api_key=224b2d4d126146f47deb3fdaeec5826b&language=en-US";
    }

    youtubeUrl = "https://www.youtube.com/embed/";
    

    fetch(trailerurl).then((response) => {return response.json()}).then((data) => 
    {
        const trailers = data.results;
        console.log(trailers);
        trailers.forEach(element => {
            if(element.site == "YouTube" && element.type == "Trailer"){
                console.log(element.key);
                youtubeUrl += element.key+"?&autoplay=1";
                console.log(youtubeUrl);
                
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