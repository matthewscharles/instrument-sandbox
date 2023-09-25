import transitionDisplay from "./transitionOut.js";

const setLaras=function(laras){
    window.laras = laras;
    let oldLaras = (laras=='slendro')?'pelog':'slendro';
    document.querySelectorAll(`.${laras}.switchable`).forEach((element)=>{
        transitionDisplay(element,true);
    });
    document.querySelectorAll(`.${oldLaras}.switchable`).forEach((element)=>{
        transitionDisplay(element,false);
    });
}

export default setLaras;