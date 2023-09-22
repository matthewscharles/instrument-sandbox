// Imports ---
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
// -----------

assignClasses();
mapper.touch.setAction('.hc');
window.addEventListener('note', noteTransition);
setTouch();
setGui();
setKeyboard();
setMidi();

window.midiNotes = [1,3,6,8,10];
window.midiNoteNames = {
    M1: 'D#4',
    M2: 'F#4',
    M3: 'A#4',
    M4: 'C#5',
    M5: 'D#5',
    M6: 'F#5'
}

Tone.context.lookahead = 0;
window.players = [...new Array(6)].map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
window.players.forEach((x,i)=>{
    x.playbackRate = 0.5 + (i/3);
})

window.addEventListener('note', (e)=>{
    // console.log('note',e.timeStamp)
    let {type, pitch, instrument} = e.detail;
    let index = Object.keys(window.midiNoteNames).indexOf(pitch);
    if(type=='on'){
        window.players[index].start().seek(0.1);    
    } else {
        window.players[index].stop();
    }
})

