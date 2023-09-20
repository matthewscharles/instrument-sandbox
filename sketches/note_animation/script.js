import noteHandler from './handler.js';
import noteTransition from './noteTransition.js';

let listenerTypes = ['pointerdown','pointerup','pointerleave','pointerenter'];

/**
 * Add a data attribute to each note, and add event listeners to each note.
 */

document.querySelectorAll('.note').forEach((note,i)=>{
    note.dataset.note = i;
    listenerTypes.forEach((x)=>{
        note.addEventListener(x,noteHandler)
    })
})

/**
 * Trigger a custom event when a note is triggered.
 */

window.addEventListener('note',noteTransition);