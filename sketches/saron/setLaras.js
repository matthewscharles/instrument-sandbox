import transitionDisplay from "./transitionOut.js";

const setLaras=function(laras){
    window.laras = laras;
    let otherLaras = (laras=='slendro')?'pelog':'slendro';
    document.querySelectorAll(`.${laras}`).forEach((element)=>{
        transitionDisplay(element,true);
    });
    document.querySelectorAll(`.${otherLaras}`).forEach((element)=>{
        transitionDisplay(element,false);
    });
}

export default setLaras;