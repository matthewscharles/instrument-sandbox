import randomText from './randomText.js';
let offsetMargin = 10;

/**
 * @function setModalButtonListeners
 * @description sets the listeners for the modal buttons -- open and close
 */

function setModalButtonListeners(){
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
}


window.addEventListener('load',()=>{
    randomText();
    setModalButtonListeners();
})
        
window.addEventListener('resize',()=>{
    let offset = document.querySelector('.modal__banner').offsetHeight + offsetMargin;
    document.querySelector('.modal__content').style.marginTop = `${offset}px`;
})



