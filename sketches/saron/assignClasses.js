import generateSelector from './generateSelector.js';

/**
 * Assign classes to elements and create new SVGs for each note.
 * @param {*} element 
 * @param {*} laras 
 * @param {*} instrument 
 */

function assignClasses(element=document,laras='slendro', instrument='saron'){
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
    });
    
    element.querySelectorAll(generateSelector('Image')).forEach((element)=>{
        let noteName = element.id.replace('_Image','');
        let classes = [noteName, 'note', instrument, laras];
        element.classList.add(...classes);
        
        let newSVG = element.parentElement.cloneNode(false);
        let container = element.parentElement.parentElement || document.body;
        
        newSVG.id = `${instrument}_${laras}_${noteName}_display`
        newSVG.classList.remove('background');
        newSVG.appendChild(element);
        container.appendChild(newSVG);
        newSVG.classList.add('note','display',instrument,laras,noteName);
    });
}

export default assignClasses