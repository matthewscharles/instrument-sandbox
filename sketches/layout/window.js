import randomText from './randomText.js';

window.addEventListener('load',()=>{
   randomText();
})
        
window.addEventListener('resize',()=>{
    document.querySelector('.modal__content').style.marginTop = document.querySelector('.modal__banner').offsetHeight + 10 + 'px';
})