import transitionDisplay from "./transitionOut.js";

/**
 * Set the current laras
 * @param {string} laras 
 */

const setLaras=function(laras){
    window.localStorage.setItem('laras',laras);
    window.laras = laras;
    let oldLaras = (laras=='slendro')?'pelog':'slendro';
    
    document.querySelectorAll(`.${oldLaras}.switchable`).forEach((element)=>{
        transitionDisplay(element,false);
    });
    
    document.querySelectorAll(`.${laras}.switchable`).forEach((element)=>{
        transitionDisplay(element,true);
    });
}

export default setLaras;