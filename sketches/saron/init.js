// Imports ---
import availableNotes from './availableNotes.js';
import addNotation from './addNotation.js';
import noteTransition from './noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import setTouch from './setTouch.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
import setLaras from './setLaras.js';
import setSamplers from './setSamplers.js';
import transitionDisplay from './transitionDisplay.js';
// -----------

const init = function(){
    
    // window.verbose = true;
    window.laras = window.localStorage.getItem('laras') || 'slendro';
    window.setLaras=setLaras;
    
    // start temporary fix for demo
    
    document.querySelectorAll('#options__laras, .options__laras path').forEach(element=>{
        element.classList[window.laras=='pelog'?'add':'remove']('on');
    })
    
    // end temporary fix for demo
    
    document.querySelectorAll('.playable').forEach(element=>{
        let instrumentLaras = element.classList.contains('pelog')?'pelog':'slendro';
        assignClasses(element, instrumentLaras);
    })
    
    setSamplers('slendro');
    setSamplers('pelog');
    
    window.addEventListener('note', noteTransition);
    document.querySelectorAll('.notation').forEach(element=>{
        addNotation(element.classList.contains('pelog')?'pelog':'slendro', element);
    });
    
    mapper.touch
        .setAction('.hc')
        .setAction('.options')
    setTouch();
    
    setKeyboard();
    
    
    let params = new URLSearchParams(location.search);
    if(params.has('dev')){
        setGui();
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
        setLaras(window.laras);
        
        document.querySelectorAll('.loading').forEach(element=>{
            transitionDisplay(element,false);
        });
        
        document.querySelectorAll('.awaitLoad').forEach(element=>element.classList.remove('disabled', 'awaitLoad'));
    });
    
    // removed functionality for now:
    
    // midi is disabled for the time being...
    // setMidi();
    
    // displayNote is a temporary event that is triggered by the sampler. see setSamplers.js
    // window.addEventListener('displayNote',noteTransition);
    
}

export default init;