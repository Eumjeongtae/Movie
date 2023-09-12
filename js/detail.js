import { en, gradeColors, imgPaths } from "./api-data.js";
import { displayImages, displayMovies, displayPeople, displayVideos, getCredits, getImages, getMovie, getSimilarMovies, getVideos } from "./api-functions.js";
import { qySel, setSlide, sortArray } from "./functions.js";

let url = new URL(location.href)
let params = new URLSearchParams(url.search)
let id = params.get('id')


let imgData = await getImages(id)
let {backdrops ,posters} = imgData 
let images = backdrops = backdrops.slice(0,15) 
let posterPath =(posters.length)? `${imgPaths.w500}${posters[0].file_path}` : './img/no-image.jpg'

let movieData = await getMovie(id)

let {title,vote_average ,vote_count ,runtime ,release_date ,overview ,original_title ,genres ,production_companies} = movieData
let hour = parseInt(runtime/60)
let min = runtime%60

release_date = (release_date) ? release_date : '출시일 정보 없음'
genres =(genres.length)?  genres.map( genre=> genre.name).join('/'): '장르 정보 없음'
let company = (production_companies.map(company => company.name).join(',').length) ? production_companies.map(company => company.name).join(',') : '제작사 정보가 없습니다.'

let credits = await getCredits(id)
let {cast,crew} = credits
cast = cast.slice(0,9)

let directors = crew.filter(v => v.job === 'Director').map(v=>v.name).join(',')
directors = (directors) ? directors : '감독정보가 없습니다'
let producers = crew.filter(v => v.job === 'Producer').map(v=>v.name).join(',')
producers = (producers) ? producers : '제작자 정보가 없습니다.'

vote_average = vote_average.toFixed(1)
let gradeLevel = Math.floor(vote_average -5)
if(gradeLevel > 4) gradeLevel =4
if(gradeLevel < 0) gradeLevel =0
let gradeColor = gradeColors[gradeLevel] 

if (!overview){
  let enMovieData = await getMovie(id,en)
  overview = (enMovieData.overview) ? enMovieData.overview : '영회 설명 정보기 없습니다.'
}

let videosData = await getVideos(id)
let videos = videosData.results
if(videos.length === 0){
  videosData = await getVideos(id,en)
  videos = videosData.results

}



setSlide(images.slice(0,4))

qySel('.poster').src = posterPath
qySel('.title').innerText = title
qySel('.avarage').innerText = vote_average
qySel('.avarage').style.color = gradeColor
qySel('.progress').style.strokeDashoffset = 10 - vote_average+'px'
qySel('.progress').style.stroke = gradeColor
qySel('.vote-cnt').innerText = `(${vote_count})`
qySel('.hour').innerText = hour
qySel('.min').innerText = min
qySel('.date').innerText = release_date
qySel('.genre').innerText = genres
qySel('.overview').innerText = overview
qySel('.original-title').innerText = original_title
qySel('.production').innerText = company
qySel('.producer').innerText = producers
qySel('.director').innerText = directors

const setSimilarSection = ()=>{
  return new Promise( async(resolve, reject) => {
    let movieDate = await getSimilarMovies(id)
    let movies = movieDate.results
    sortArray(movies,'popularity',-1)
    movies = movies.slice(0,10)
    displayMovies(movies,'.similar-section .grid-container')

    resolve()
  })
}

displayPeople(cast,'.people-section .grid-container')
displayImages(images,'.image-section .grid-container')
displayVideos(videos,'.video-section .grid-container')
await setSimilarSection()
