import selector from './selector.js';
import noteTransition from '../note_animation/noteTransition.js';
import {setGui} from './setGui.js';
import setKeyboard from './setKeyboard.js';
import noteTrigger from '../note_trigger/note_trigger.js';
import setMidi from './setMidi.js';

document.querySelectorAll(selector('hc')).forEach((x)=>{
    let noteName = x.id.replace('_Imageremove_hc','');
    let classes = [ noteName,
                    'note',
                    'hc',
                    'saron',
                    'pelog'
                  ]; 
    x.classList.add('note', ...classes);
    x.querySelectorAll('path').forEach((y,i)=>{
        y.classList.add('note', ...classes);
        y.id = `${'saron'}_${'pelog'}_${noteName}_hc`;
        y.dataset.note = noteName;
        y.dataset.instrument = 'saron';
    })
});

document.querySelectorAll(selector('Image')).forEach((x)=>{
    let noteName = x.id.replace('_Image','');
    let classes = [ noteName,
                    'note',
                    'saron',
                    'pelog'
                ]
    x.classList.add('note', ...classes);
    let newSVG = x.parentElement.cloneNode(false);
    newSVG.classList.remove('background');
    newSVG.appendChild(x)
    document.body.appendChild(newSVG);
    newSVG.classList.add('note','display','saron','pelog',noteName);
});

touch.setAction('.hc');
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
