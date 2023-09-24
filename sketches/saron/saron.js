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
    document.querySelectorAll('.playable').forEach(element=>{
        let instrumentLaras = element.classList.contains('pelog')?'pelog':'slendro';
        assignClasses(element, instrumentLaras);
    })
    
    setSamplers('slendro');
    setSamplers('pelog');
    
    window.addEventListener('note', noteTransition);
    document.querySelectorAll('.notation').forEach(element=>{
        addNotation(element.classList.contains('pelog')?'pelog':'slendro', element);
    })
    // addNotation(window.laras, document.querySelector('.notation'));
    
    mapper.touch
        .setAction('.hc')
        .setAction('.options')
    setTouch();
    setGui();
    setKeyboard();
    
    
    let params = new URLSearchParams(location.search);
    if(!params.has('dev')){
      gui.hide();
    }

    window.auto_off = false;
    window.midiNotes = [1,3,6,8,10];

    Tone.context.lookahead = 0;

    window.addEventListener('note', (e)=>{
        let {type, pitch, instrument, laras} = e.detail;
        let index = availableNotes[laras].indexOf(pitch);
        if(type=='on'){
            window.players[laras][index].start(Tone.immediate(),0.1);    
        } else {
            if(window.auto_off) window.players[laras][index].stop();
        }
    });
    
    Tone.loaded().then(()=>{
        document.querySelectorAll('.loading').forEach(element=>{
            transitionDisplay(element,false);
        })
        document.querySelectorAll('.awaitLoad').forEach(element=>element.classList.remove('disabled', 'awaitLoad'));
    });
    
    // removed functionality for now:
    
    // midi is disabled for the time being...
    // setMidi();
    
    // displayNote is a temporary event that is triggered by the sampler. see setSamplers.js
    // window.addEventListener('displayNote',noteTransition);
    
}

window.addEventListener('load', () => {
    document.querySelectorAll('.svg-import').forEach(element => {
        replaceSvgObject(element);
    });
    
    init();
});


