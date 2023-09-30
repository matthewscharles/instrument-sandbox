import generateSelector from './generateSelector.js';
import addNoteOffArea from './addNoteOffArea.js';


/**
 * Assign classes to elements and create new SVGs for each note.
 * @param {*} element 
 * @param {*} laras 
 * @param {*} instrument 
 */

function assignClasses(element=document,laras='slendro', instrument='saron'){
    let HC = {slendro:{},pelog:{}};
    element.querySelectorAll(generateSelector('hc')).forEach((element)=>{
        let noteName = element.id.replace('_Imageremove_hc','');
        let classes = [noteName,'note','hc',instrument,laras]; 
        element.classList.add(...classes);
        element.querySelectorAll('path,polygon,polyline').forEach((y,i)=>{
            y.classList.add('note', ...classes);
            y.id = `${instrument}_${laras}_${noteName}_hc_${i}`;
            y.dataset.note = noteName;
            y.dataset.instrument = instrument;
        })
        
        HC[laras][noteName] = element;
    });
    
    element.querySelectorAll(generateSelector('Image')).forEach((imageGroup)=>{
        let noteName = imageGroup.id.replace('_Image','');
        let classes = [noteName, 'note', instrument, laras];
        imageGroup.classList.add(...classes);
        
        let newSVG = imageGroup.parentElement.cloneNode(false);
        let container = imageGroup.parentElement.parentElement || document.body;
    
        newSVG.id = `${instrument}_${laras}_${noteName}_display`;
        newSVG.classList.remove('background');
        newSVG.appendChild(imageGroup);

        if(newSVG.classList.contains('playable')) addNoteOffArea(newSVG, laras, noteName, instrument, imageGroup, HC);
        
        container.appendChild(newSVG);
        newSVG.classList.add('note','display',instrument,laras,noteName);
    });
}

export default assignClasses;