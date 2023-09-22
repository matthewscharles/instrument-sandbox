// Imports ---
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
// -----------
const availableNotes = ['M1','M2','M3','M4','M5','M6'];

assignClasses();
mapper.touch.setAction('.hc');
window.addEventListener('note', noteTransition);
setTouch();
setGui();
setKeyboard();
setMidi();

window.midiNotes = [1,3,6,8,10];

Tone.context.lookahead = 0.01;
window.players = [...new Array(6)].map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
window.players.forEach((x,i)=>{
    x.playbackRate = 0.5 + (i/3);
})

window.addEventListener('note', (e)=>{
    // console.log('note',e.timeStamp)
    let {type, pitch, instrument} = e.detail;
    let index = availableNotes.indexOf(pitch);
    if(type=='on'){
        window.players[index].start().seek(0.1);    
    } else {
        window.players[index].stop();
    }
})

