import randomText from './randomText.js';

window.addEventListener('load',()=>{
   randomText();
   document.querySelector('.modal__close').addEventListener('click',()=>{
         $('.modal').hide(1000);
         $('.main').show(1000);
    });
    document.querySelector('.modal__open').addEventListener('click',()=>{
        $('.modal').show(1000);
        $('.main').hide(1000);
    });
})
        
window.addEventListener('resize',()=>{
    document.querySelector('.modal__content').style.marginTop = document.querySelector('.modal__banner').offsetHeight + 10 + 'px';
})



