/**
 * @function setModalButtonListeners
 * @description sets the listeners for the modal buttons -- open and close.  containers need sub-containers with positions, otherwise sliding animations occur
 * @returns {void}
 */

function setModalButtonListeners(){
    document.querySelectorAll('.modal__close').forEach(element=>{
        element.addEventListener('click',()=>{
            $('.modal').hide(1000);
            $('.main').show(1000);
        });
    });
    
    document.querySelectorAll('.modal__open').forEach(element=>{
        element.addEventListener('click',()=>{
            $('.modal').show(1000);
            $('.main').hide(1000);
        });   
    });
}

export default setModalButtonListeners;