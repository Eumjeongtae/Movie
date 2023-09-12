import { imgPaths, ko, options } from "./api-data.js";
import { displayMovies, getMovies } from "./api-functions.js";
import { qySel, qySelAll } from "./functions.js";

let url = new URL(location.href)
let params = new URLSearchParams(url.search)
let list = params.get('list')
let page = parseInt(params.get('page'))

let option
if (list === 'playing') {
  option = options.playing
  qySel('.list-title').innerText = '현재상영작'
  qySel('.list-section em').innerText = '현재상영작'

} else if (list === 'popular') {
  option = options.popular
  qySel('.list-title').innerText = '인기영화'
  qySel('.list-section em').innerText = '인기영화'



} else if (list === 'upcoming') {
  option = options.upcoming
  qySel('.list-title').innerText = '최신/개봉예정작'
  qySel('.list-section em').innerText = '최신/개봉예정작'

}

let movieData = await getMovies(option, ko, page)
let movies = movieData.results
let totalPages = parseInt(movieData.total_pages)
if (totalPages > 500) totalPages = 500
let startPaging = (page % 5 !== 0) ? Math.floor(page / 5) * 5 + 1 : Math.floor(page / 5) * 5 - 4 // 5페이지 일떄 시작번호 페이지 
let endPaging = startPaging + 4
endPaging = (endPaging > totalPages) ? totalPages : endPaging
let finishPaging = Math.floor(totalPages/5) * 5 -5 // 마지막 페이지의 첫번째 숫자부터


if (page > 5) {
  qySel('.paging').insertAdjacentHTML('beforeend', `
  <a href="./list.php?list=${list}&page=${startPaging-5}"><i class="fa-solid fa-chevron-left"></i></a>
  `)
}

for (let i = startPaging; i <= endPaging; i++) {
  qySel('.paging').insertAdjacentHTML('beforeend', `
    <a href="./list.php?list=${list}&page=${i}" class="paging-btn${i}">${i}</a>
  `)

}
qySel(`.paging-btn${page}`).classList.add('active')

if ( page <= finishPaging ) {
  qySel('.paging').insertAdjacentHTML('beforeend', `
  <a href="./list.php?list=${list}&page=${startPaging+5}"><i class="fa-solid fa-chevron-right"></i></a>
  `)
}

displayMovies(movies, '.grid-container')

let images = movies.slice(0,5).map(v=>{
  return `${imgPaths.original}${v.backdrop_path}`
})
const setSlide = (images) => {

    images.forEach((imgPath, i) => {
      
      

      qySel('.slide').insertAdjacentHTML('beforeend', `
        <img class="slide-img${i + 1}" src='${imgPath}' alt>
      `)

    });
    let n = 1;
    setTimeout(() => {
      qySel('.slide-img1').classList.add('active')
    }, 10);
    setInterval(() => {
      n++
      if (n > qySelAll('.slide img').length) n = 1
      qySelAll('.slide img').forEach(img => {
        img.classList.remove('active')
      })
      qySel(`.slide-img${n}`).classList.add('active')
  
    }, 5000);

}
setSlide(images)