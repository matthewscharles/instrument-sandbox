const glide = false;

/**
 * Detect pointer events over a note, and add/remove the class 'on' to the note.
 * @param {event} e 
 */

function noteHandler(e){
    let {type, target} = e;
    let events = ['pointerdown'];
    let notes = ['C','Csharp','D','Dsharp','E','F','Fsharp','G','Gsharp','A','Asharp','B'];
    if(glide) events.push('pointerenter');
    let value = events.includes(type) ? 'on' : 'off';
    const event = new CustomEvent('note',{
        detail:{
            type: value,
            instrument:'piano',
            pitch: notes[target.dataset.note]      
        }
    });
    
    window.dispatchEvent(event);
}

export default noteHandler;