import noteTrigger from './noteTrigger.js';

/**
 * Set MIDI mapping for the saron
 */

const setMidi = function(){
    window.midiNotes = window.midiNotes || [1,3,6,8,10];
    midi.listen();
    midi.map[0].noteRange['0,127']=function(pitch,velocity){
        let note = pitch % 12;
        let noteNumber = midiNotes.indexOf(note);
        if(noteNumber==-1) return;
        noteTrigger('saron',`M${noteNumber+1}`,velocity?'on':'off');
    }
}

export default setMidi;
