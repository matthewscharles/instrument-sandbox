
import randomText from './randomText.js';
import setModalButtonListeners from './setModalButtonListeners.js';

let offsetMargin = 10;

window.addEventListener('load',()=>{
    randomText();
    setModalButtonListeners();
})
        
window.addEventListener('resize',()=>{
    let offset = $('.modal__banner').outerHeight() + offsetMargin;
    $('.modal__content').css('margin-top', `${offset}px`);
})



