import { qySel } from "./functions.js"

export let scrollY = window.scrollY


const setTopBtn = ()=>{
  if(scrollY > 300){
    qySel('.top-btn').classList.add('active')
  }else{
    qySel('.top-btn').classList.remove('active')

  }
}

setTopBtn()



window.addEventListener('resize',e=>{
  scrollY = window.scrollY
  setTopBtn()
})

window.addEventListener('scroll',e=>{
  scrollY = window.scrollY
  setTopBtn()
})

qySel('.top-btn').addEventListener('click',e=>{
  window.scrollTo({
    top : 0,
    behavior : 'smooth'
  })
})

qySel('.toggle-btn').addEventListener('click',e=>{
  qySel('.menu-list ul').classList.toggle('active')
})