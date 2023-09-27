import generateSelector from './generateSelector.js';

/**
 * This is tied to assignClasses
 * @param {HTMLElement} newSVG 
 * @param {string} laras 
 * @param {string} noteName 
 * @param {string} instrument 
 * @param {HTMLElement} imageGroup 
 * @param {Object} HC 
 * @see assignClasses
 * @memberof saron
 */

const addNoteOffArea = function(newSVG,laras,noteName,instrument, imageGroup, HC){
        let maskElement = HC[laras][noteName].querySelector('path, polygon, polyline');

        if(maskElement){
            // the line is harsh partly because it doesn't follow the 3d curve of the key
            let dampingRectGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
            let dampingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
            let imageElement = imageGroup.querySelector('image');
            dampingRect.setAttribute('x',imageElement.x.baseVal.value);
            dampingRect.setAttribute('y',imageElement.y.baseVal.value);
            dampingRect.setAttribute('width',imageElement.width.baseVal.value);
            dampingRect.setAttribute('height',imageElement.height.baseVal.value);
            dampingRect.setAttribute('transform',imageElement.getAttribute('transform'));
            // the fill is a bit harsh.
            // there might be a way to apply a gradient to soften the edges down the line...
            dampingRect.setAttribute('fill', 'gray');
            dampingRect.setAttribute('stroke', '#000');
            dampingRect.setAttribute('rx', '5');
            dampingRect.setAttribute('ry', '5');
            dampingRect.setAttribute('opacity', 0.2);
            dampingRectGroup.appendChild(dampingRect);
            
            let mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
            mask.id = `${instrument}_${laras}_${noteName}_mask`;
            
            let clonedMask = maskElement.cloneNode(true);
            clonedMask.setAttribute('fill', '#fff');
            
            mask.appendChild(clonedMask);
            // or use a line drawn at the point of svg prep...
            let top = dampingRect.getAttribute('height') * 0.8;
            dampingRect.setAttribute('y', top);
            
            let dampingLine = document.createElementNS('http://www.w3.org/2000/svg','line');
            dampingLine.setAttribute('x1', dampingRect.getAttribute('x'));
            dampingLine.setAttribute('x2', dampingRect.getAttribute('width'));
            dampingLine.setAttribute('y1', dampingRect.getAttribute('y'));
            dampingLine.setAttribute('y2', dampingRect.getAttribute('y'));
            dampingLine.setAttribute('transform', dampingRect.getAttribute('transform'));
            // dampingLine.setAttribute('stroke-width', dampingRect.getAttribute('height') * 0.01);
            dampingLine.setAttribute('stroke', '#000');
            dampingLine.setAttribute('opacity', 0.4)
            dampingLine.setAttribute('stroke-linecap', 'round');
            
            dampingRectGroup.appendChild(mask);
            dampingRectGroup.setAttribute('mask', `url(#${mask.id})`);
            dampingRectGroup.appendChild(dampingLine);
            
            newSVG.appendChild(dampingRectGroup);        
        }
        
        
    
}


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