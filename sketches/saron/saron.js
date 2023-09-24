// Imports ---
import { replaceSvgObject } from './replaceSvgObject.js';
import noteTransition from './noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
import setSamplers from './setSamplers.js';
// -----------
const availableNotes = ['M1','M2','M3','M5','M6','H1'];

const convertFromObjects = false;

function init(){
    Tone.start();
    assignClasses();
    setSamplers();
    window.addEventListener('note', noteTransition);
    mapper.touch.setAction('.hc');
    setTouch();
    setGui();
    setKeyboard();
    // setMidi();

    window.auto_off = false;
    window.midiNotes = [1,3,6,8,10];

    Tone.context.lookahead = 0;

    window.addEventListener('note', (e)=>{
        let {type, pitch, instrument} = e.detail;
        let index = availableNotes.indexOf(pitch);
        if(type=='on'){
            window.players[index].start(Tone.immediate(),0.1);    
        } else {
            if(window.auto_off) window.players[index].stop();
        }
    });
}

window.addEventListener('load', () => {
    if(convertFromObjects){
        replaceAllSvg().then(init);
    } else {
        document.querySelectorAll('.svg-import').forEach(element => {
            replaceSvgObject(element);
        });
        init();
    }
});


