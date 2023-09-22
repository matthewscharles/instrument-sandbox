// Imports ---
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import noteTrigger from '../note_trigger/note_trigger.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
// -----------

assignClasses();
mapper.touch.setAction('.hc');
window.addEventListener('note', noteTransition)
document.addEventListener('touch-pickup', (e)=>{
    Tone.start();
    let {element,type} = e.detail;
    if(!['start','enter','end','leave'].includes(type)) return;
    noteTrigger(element.dataset.instrument,element.dataset.note,type=='start'||type=='enter'?'on':'off')
})

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
window.players = [];
for(let i=0;i<6;i++){
    window.players.push(new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
}
window.synth = new Tone.PolySynth().toDestination();
window.player = new Tone.Player('sounds/H3.wav').toDestination();
window.player2 = new Tone.Player('sounds/H3.mp3').toDestination();
window.addEventListener('note', (e)=>{
    console.log('note',e.timeStamp)
    let {type, pitch, instrument} = e.detail;
    let index = Object.keys(window.midiNoteNames).indexOf(pitch);
    if(type=='on'){
        window.players[index].start().seek(0.1);    
    } else {
        window.players[index].stop();
    }
    
    // window.synth[type=='on'?'triggerAttack':'triggerRelease'](midiNoteNames[pitch]);
})

