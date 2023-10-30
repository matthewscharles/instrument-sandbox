import randomText from './randomText.js';

window.addEventListener('load',()=>{
   randomText();
   document.querySelector('.modal__close').addEventListener('click',()=>{
        // the contents of these containers must be set to [position: absolute] or [position: fixed]
        // i.e. sub-containers are needed
        // to avoid tacky animations
         $('.modal').hide(1000);
         $('.main').show(1000);
    });
    document.querySelector('.modal__open').addEventListener('click',()=>{
        $('.modal').show(1000);
        $('.main').hide(1000);
    });
})
        
window.addEventListener('resize',()=>{
    let offset = document.querySelector('.modal__banner').offsetHeight + 10;
    document.querySelector('.modal__content').style.marginTop = `${offset}px`;
})



