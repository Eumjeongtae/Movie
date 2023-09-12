import { genreList } from "./api-data.js";
import { controller, displayMovies, searchByGenres, searchByKeyword } from "./api-functions.js";
import { qySel, qySelAll, setSlide, sortArray } from "./functions.js";

setSlide([])

let timeoutId
let page
let totalPages
let genreNumbers = []
let isPending = true

const setDataList = () => {
  if (!localStorage.getItem('keywordsStorage')) return false
  let keywords = JSON.parse(localStorage.getItem('keywordsStorage'))
  keywords.forEach(keyword => {
    qySel('datalist#keyword-list').insertAdjacentHTML('beforeend', `
        <option>${keyword}</option>
      `)
  })
}
setDataList()


qySel('.search-input').addEventListener('input', e => {
  clearTimeout(timeoutId)
  page = 1
  isPending = true
  genreNumbers = []
  qySelAll('.genre-btn').forEach(btn => {
    btn.classList.remove('active')
  })

  qySel('.search-result-section .grid-container').innerHTML = ''
  if(e.target.value === '') return false

  timeoutId = setTimeout(async () => {
    controller.abort() //이전 fetch를 취소하고 새로 받아옴
    let movieData = await searchByKeyword(e.target.value)
    let movies = movieData.results
    sortArray(movies, 'release_date', -1)
    
    displayMovies(movies, '.search-result-section .grid-container')


    let keywords = localStorage.getItem('keywordsStorage') ? JSON.parse(localStorage.getItem('keywordsStorage')) : []
    if (movies.length === 0 || keywords.includes(e.target.value)) return
    keywords.unshift(e.target.value)  //unshift와 sort는  return하지않음
    keywords = keywords.slice(0.10)
    localStorage.setItem('keywordsStorage', JSON.stringify(keywords))
    qySel('datalist#keyword-list').innerHTML = ''

    keywords.forEach(keyword => {
      qySel('datalist#keyword-list').insertAdjacentHTML('beforeend', `
        <option>${keyword}</option>
      `)
    });//foreach
  }, 500);
})

qySel('.search-form').addEventListener('submit', e => {
  e.preventDefault()
})

qySel('.delete-btn').addEventListener('click', e => {
  if (!confirm('검색 기록을 삭제하시겠습니까?')) return
  localStorage.removeItem('keywordsStorage')
  qySel('#keyword-list').innerHTML = ''
})

const setGenreBtns = () => {
  for (let genreNumber in genreList) {
    qySel('.genre-btns').insertAdjacentHTML('beforeend', `
      <button class="genre-btn" value = "${genreNumber}" >${genreList[genreNumber]}</button>
    `)
  }//오브젝트형 데이터는 for in 사용하면 key값 출력가능
}


const genreBtnsHandler = () => {

  qySelAll('.genre-btns').forEach(btn => {
    btn.addEventListener('click', async e => {
      isPending = true
      qySel('.search-input').value == ''
      qySel('.grid-container').innerHTML = ''
      e.target.classList.toggle('active')
      page = 1


      let idx = genreNumbers.indexOf(e.target.value)
      if (idx === -1) { genreNumbers.push(e.target.value) }
      else { genreNumbers.splice(idx, 1) }
      if(genreNumbers.length ===0 ) {
        return false
      }

      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {

        controller.abort() //이전 fetch를 취소하고 새로 받아옴
        let movieData = await searchByGenres(genreNumbers.join(','))
        totalPages = movieData.total_pages
        let movies = movieData.results

        displayMovies(movies, '.search-result-section .grid-container')
        isPending = false

      }, 500);




    })
  })
}


setGenreBtns()
genreBtnsHandler()

const observer = new IntersectionObserver(async([entry])=>{
  if(entry.intersectionRatio > .1 && isPending === false){
    isPending = true;
    page++
    if(page > totalPages || page > 10) return
    let movieDate = await searchByGenres(genreNumbers,page)
    let movies = movieDate.results
    displayMovies(movies,'.grid-container')
    isPending = false;

  }
})

observer.observe(qySel('.trigger'))





