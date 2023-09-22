// Imports ---
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import noteTrigger from '../note_trigger/note_trigger.js';
import setMidi from './setMidi.js';
import assignClasses from './assignClasses.js';
// -----------

assignClasses();
touchMapper.setAction('.hc');
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

window.synth = new Tone.PolySynth().toDestination();
Tone.start();
window.addEventListener('note', (e)=>{
    let {type, pitch, instrument} = e.detail;
    window.synth[type=='on'?'triggerAttack':'triggerRelease'](midiNoteNames[pitch]);
})
