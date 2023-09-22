// Imports ---
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
import setSamplers from './setSamplers.js';
// -----------
const availableNotes = ['M1','M2','M3','M5','M6','H1'];

assignClasses();
setSamplers();
mapper.touch.setAction('.hc');
window.addEventListener('note', noteTransition);
setTouch();
setGui();
setKeyboard();
setMidi();

window.midiNotes = [1,3,6,8,10];

Tone.context.lookahead = 0;


window.addEventListener('note', (e)=>{
    // console.log('note',e.timeStamp)
    let {type, pitch, instrument} = e.detail;
    let index = availableNotes.indexOf(pitch);
    if(type=='on'){
        window.players[index].start(Tone.immediate(),0.1);    
    } else {
        window.players[index].stop();
    }
})

