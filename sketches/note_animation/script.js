import handler from './handler.js';

let listenerTypes = ['pointerdown','pointerup','pointerleave','pointerenter'];
document.querySelectorAll('.note').forEach((note,i)=>{
    note.dataset.note = i;
    listenerTypes.forEach((x)=>{
        note.addEventListener(x,handler)
    })
})