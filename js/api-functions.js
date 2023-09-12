import { baseUrl, api_key, ko, en, options, imgPaths, gradeColors, genreList } from "./api-data.js";
import { qySel, qySelAll, setPersonModal, showModal, sortArray, videoResize } from "./functions.js";


export const getMovies = (option, lang = ko,page=1) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}${option}${api_key}${lang}&page=${page}&include_adult=false`)
    let data = await result.json()
    resolve(data)
  })
}

export const getMovie = (movieId, lang = ko,) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}/movie/${movieId}${api_key}${lang}&include_adult=false`)
    let data = await result.json()
    resolve(data)
  })
}

export const getVideos = (movieId, lang = ko) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}/movie/${movieId}/videos${api_key}${lang}&include_adult=false`)
    let data = await result.json()
    resolve(data)
  })
}

export const getImages = (movieId) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}/movie/${movieId}/images${api_key}`)
    let data = await result.json()
    resolve(data)
  })
}

export const getSimilarMovies = (movieId, lang = ko) => {
  return new Promise(async (resolve, reject) => {

    let result = await fetch(`${baseUrl}/movie/${movieId}/similar${api_key}${lang}&include_adult=false`)
    let data = await result.json()
    resolve(data)
  })

}

export const displayMovies = (data, container, gridClassName = '') => {
  if (data.length === 0) {
    qySel(container).innerHTML = '<p class="no-data">관련 영화목록이 존재하지 않습니다.</p>'
    return false
  }

  data.forEach(movie => {

    let { id, poster_path, title, vote_average, genre_ids, release_date } = movie
    let imgPath = (poster_path) ? `${imgPaths.w500}${poster_path}` : './img/no-image.jpg'

    vote_average = vote_average.toFixed(1)
    let gradeLevel = Math.floor(vote_average - 5)
    if (gradeLevel > 4) gradeLevel = 4
    if (gradeLevel < 0) gradeLevel = 0
    let gradeColor = gradeColors[gradeLevel]

    let genres = genre_ids.map(num => genreList[num]).join('/')
    qySel(container).insertAdjacentHTML('beforeend', `
          <figure class=${gridClassName}>
            <a href="./detail.php?id=${id}">
              <div class="imgbox">
                <img src=${imgPath} alt="">
                <span style ="background-color:${gradeColor};"></span>
                <small>${vote_average}</small>
              </div>
              <figcaption>
                <h3>${title}</h3>
                <p>${genres}</p>
                <p>${release_date}</p>
              </figcaption>

            </a>

        </figure>
      `)
  });
}

export const getCredits = (movieId, lang = ko) => {
  return new Promise(async (resolve, reject) => {
    let result = await fetch(`${baseUrl}/movie/${movieId}/credits${api_key}${lang}`)
    let data = await result.json()
    resolve(data)
  })
}

export const displayVideos = (data, container) => {
  if (data.length === 0) {
    qySel(container).innerHTML = '<p class="no-data">관련 영화목록이 존재하지 않습니다.</p>'
    return
  }
  data.forEach(video => {
    let { key } = video
    qySel(container).insertAdjacentHTML('beforeend', `
      <button value="${key}">
        <img src="https://img.youtube.com/vi/${key}/mqdefault.jpg" alt>
      </button>
      
    `)
  })
  qySelAll(`${container} button`).forEach(btn => {
    btn.addEventListener('click', e => {

      showModal('.video-modal')
      // qySel('.video-modal').style.display = 'block'
      let youtubeId = e.currentTarget.value
      qySel('.video-modal iframe').src = `http://www.youtube.com/embed/${youtubeId}?playlist=${youtubeId}&autoplay=1&loop=1&mute=1&playsinline=1`
      videoResize()
    })

  })
}

export const displayImages = (data, container) => {
  if (data.length === 0) {
    qySel(container).innerHTML = '<p class="no-data">관련 이미지가 존재하지 않습니다.</p>'
    return
  }
  data.forEach(img => {
    let { file_path } = img
    let imgPathOriginal = `${imgPaths.original}${file_path}`
    let imgPathw500 = `${imgPaths.w500}${file_path}`

    qySel(container).insertAdjacentHTML('beforeend', `
      <a class="viewbox-btn" href=${imgPathOriginal}>
        <img src=${imgPathw500} alt>
      </a>
    `)

  })

  $('.viewbox-btn').viewbox()

}

export const displayPeople = (data, container) => {
  if (data.length === 0) {
    qySel(container).innerHTML = '<p class="no-data">관련 인물이 존재하지 않습니다.</p>'
    return
  }

  data.forEach(person => {
    let { id, name, character, profile_path } = person

    let photo = (profile_path) ? `${imgPaths.w500}${profile_path}` : './img/no-image.jpg'

    qySel(container).insertAdjacentHTML('beforeend', `
      <figure>
        <a href="${id}">
          <img src="${photo}" alt>
          <figcaption>
            <em>${name}</em>
            <b>${character}역</b>
          </figcaption>
        </a>
      </figure>
    `)
  })//forEach

  qySelAll(`${container} a`).forEach(anchor => {
    anchor.addEventListener('click', async e => {
      e.preventDefault()
      let id = e.currentTarget.getAttribute('href')
      let profile = await getProfile(id, en)
      displayProfile(profile)
      let filmography = await getFilmography(id, ko)
      displayFilmography(filmography)
      showModal('.person-modal')
      setPersonModal()
    })
  })//forEach
}

export const getProfile = (personId, lang = en) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}/person/${personId}${api_key}${lang}`);
    let data = await result.json()
    resolve(data)
  })
}

export const displayProfile = (profileData) => {
  let { profile_path, name, birthday, deathday, known_for_department, place_of_birth, biography } = profileData
  let photoPath = (profile_path) ? `${imgPaths.w500}${profile_path}` : './img/no-image.jpg'
  name = (name) ? name : '관련 정보가 없습니다'
  known_for_department = (known_for_department) ? known_for_department : '관련 정보가 없습니다'
  place_of_birth = (place_of_birth) ? place_of_birth : '관련 정보가 없습니다'
  biography = (biography) ? biography : '관련 정보가 없습니다'
  deathday = (deathday) ? deathday : ''
  birthday = (birthday) ? `${birthday} ~ ${deathday}` : '관련 정보가 없습니다'

  qySel('.person-photo').src = photoPath

  qySel('.person-name').innerHTML = name
  qySel('.person-job').innerHTML = known_for_department
  qySel('.person-life').innerHTML = birthday
  qySel('.person-place').innerHTML = place_of_birth
  qySel('.person-biography').innerHTML = biography


}

export const getFilmography = (personId, lang = ko) => {
  return new Promise(async (resolve) => {
    let result = await fetch(`${baseUrl}/person/${personId}/movie_credits${api_key}${lang}`)
    let data = await result.json()
    resolve(data)


  })
}

export const displayFilmography = (filmographyDate) => {
  let { cast, crew } = filmographyDate

  let filmography = [...cast, ...crew]

  qySel('ul.filmography').innerHTML = ''
  sortArray(filmography, 'popularity', -1)
  filmography = filmography.slice(0, 20)
  sortArray(filmography, 'release_date', -1)

  filmography.forEach(movie => {
    let { id, release_date, title, job } = movie
    job = (job) ? job : 'acting'
    qySel('ul.filmography').insertAdjacentHTML('beforeend', `
      <li>
        <time>${release_date}</time>
        <a href="detail.php?id=${id}">
          <em>${title}</em>
          <small>(${job})</small>
        
        </a>
      </li>
    `)
  })

}

export let controller = new AbortController() // fetch를 중지시키는 break
let signal = controller.signal

export const searchByKeyword = (keyword, lang = ko) => {
  return new Promise(async (resolve) => {
    controller = new AbortController()
    signal = controller.signal
    try {
      const result = await fetch(
        `${baseUrl}/search/movie${api_key}&${lang}&query=${keyword}`,
        { signal }
      )
      const data = await result.json()
      resolve(data)
    } catch  {}


  })
}

export const searchByGenres= (genreNumbers,page=1)=>{
  return new Promise(async(resolve) => {
    controller = new AbortController()
    signal = controller.signal

    const result = await fetch(`${baseUrl}/discover/movie${api_key}&with_genres=${genreNumbers}&page=${page}` , {signal})
    const data = await result.json()
    resolve(data)
  })
}


