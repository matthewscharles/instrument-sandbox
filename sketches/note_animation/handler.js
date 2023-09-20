const glide = false;

/**
 * Detect pointer events over a note, and add/remove the class 'on' to the note.
 * @param {event} e 
 */

function noteHandler(e){
    let {type, target} = e;
    let events = ['pointerdown'];
    
    if(glide) events.push('pointerenter');
    let value = events.includes(type);
    
    target.classList[value?'add':'remove']('on');
}

export default noteHandler;