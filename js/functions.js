import { imgPaths } from "./api-data.js"

export const qySel = (el) => {
  return document.querySelector(el)
}
export const qySelAll = (el) => {
  return document.querySelectorAll(el)
}

export const setSwiper = (el, sec = false, breakpoint = false) => {
  const swiper = new Swiper(el, {

    autoplay: (!sec) ? false : {
      delay: sec,
      disableOnInteraction: false
    },

    loop: true,
    navigation: {
      nextEl: '.next',
      prevEl: '.prev',
    },
    pagination: {
      el: '.pagination',
      type: 'bullets',
      clickable: true,
    },

    slidesPerView: 1,
    slidesPerGroup: 1,

    breakpoints: (breakpoint) && {
      300: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      600: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      900: {
        slidesPerView: 4,
        slidesPerGroup: 4,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 5,
      },
      1500: {
        slidesPerView: 6,
        slidesPerGroup: 6,
      },
    }

  });
}

export const videoResize = () => {
  let videoWidth = qySel('.youtube-ratio').clientWidth
  let videoHeight = qySel('.youtube-ratio').clientHeight
  qySel('.video-modal iframe').style.width = `${videoWidth}px`
  qySel('.video-modal iframe').style.height = `${videoHeight}px`

}

export const setSlide = (images) => {
  if (images.length < 2) {
    for (let i = 1; i <= 4; i++) {
      qySel('.slide').insertAdjacentHTML('beforeend', `
        <img class="slide-img${i}" src='./img/film${i}.jpg' alt>
      `)
    }
  } else {
    images.forEach((imgInfo, i) => {
      let { file_path } = imgInfo
      let imgPath = `${imgPaths.original}${file_path}`

      qySel('.slide').insertAdjacentHTML('beforeend', `
        <img class="slide-img${i + 1}" src='${imgPath}' alt>
      `)

    });
  }
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

export const sortArray = (arr, sortby, asc) => {
  arr.sort((a, b) => {
    if (a[sortby] > b[sortby]) return asc
    else if (a[sortby] < b[sortby]) return -asc
    else return 0
  })

}

export const showModal = (modal) => {
  qySel(modal).style.display = 'block'
  document.body.style.overflow = 'hidden'

}

export const closeModal = (modal) => {
  qySel(modal).style.display = 'none'
  document.body.style.overflow = 'auto'

}

export const setPersonModal = ()=>{
  qySelAll('.person-modal ul').forEach(ul=>{
    if(ul.scrollHeight <= ul.clientHeight){
      ul.nextElementSibling.style.display='none'
    }else{
      ul.nextElementSibling.style.display='inline-block'
      
    }
  })
  qySelAll('.person-modal .more-btn').forEach(btn => {
      btn.classList.remove('active')
    })

}

