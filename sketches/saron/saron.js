// Imports ---
import availableNotes from './availableNotes.js';
import addNotation from './addNotation.js';
import { replaceSvgObject } from './replaceSvgObject.js';
import noteTransition from './noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
import setSamplers from './setSamplers.js';
import transitionDisplay from './transitionOut.js';
// -----------

function init(){
    window.laras = window.laras || 'slendro';
    Tone.start();
    assignClasses();
    setSamplers('slendro');
    setSamplers('pelog');
    window.addEventListener('note', noteTransition);
    addNotation(window.laras, document.querySelector('.notation'));
    // displayNote is a temporary event that is triggered by the sampler, see setSamplers.js
    // window.addEventListener('displayNote',noteTransition);
    mapper.touch
        .setAction('.hc')
        .setAction('.options')
    setTouch();
    setGui();
    setKeyboard();
    // midi is disabled for the time being...
    // setMidi();
    
    let params = new URLSearchParams(location.search);
    if(!params.has('dev')){
      gui.hide();
    }

    window.auto_off = false;
    window.midiNotes = [1,3,6,8,10];

    Tone.context.lookahead = 0;

    window.addEventListener('note', (e)=>{
        let {type, pitch, instrument} = e.detail;
        let index = availableNotes[window.laras].indexOf(pitch);
        if(type=='on'){
            window.players[window.laras][index].start(Tone.immediate(),0.1);    
        } else {
            if(window.auto_off) window.players[window.laras][index].stop();
        }
    });
    
    Tone.loaded().then(()=>{
        document.querySelectorAll('.loading').forEach(element=>{
            transitionDisplay(element,false);
        })
        document.querySelectorAll('.awaitLoad').forEach(element=>element.classList.remove('disabled', 'awaitLoad'));
    });
    
}

window.addEventListener('load', () => {
    document.querySelectorAll('.svg-import').forEach(element => {
        replaceSvgObject(element);
    });
    
    init();
});


