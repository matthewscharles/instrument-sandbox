import availableNotes from './availableNotes.js';

const addNotation = function(laras="slendro", container, classes="note display text", instrument="saron"){
    if(!container) return;
    availableNotes[laras].forEach((note,i)=>{
        let noteElement = document.createElement('span');
        noteElement.classList.add(...classes.split(' '), laras, note, instrument);
        noteElement.innerHTML = note[1];
        container.appendChild(noteElement);
    });
}

export default addNotation;