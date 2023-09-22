import noteTrigger from '../note_trigger/note_trigger.js';

function setKeyboard(){
    window.keysSaron = {
        A: 'M1',
        S: 'M2',
        D: 'M3',
        F: 'M5',
        G: 'M6',
        H: 'H1'
    }
    window.saronKeys = {
        M1: 'A',
        M2: 'S',
        M3: 'D',
        M5: 'F',
        M6: 'G',
        H1: 'H'
    }
    keyboardMapper.keymap['Key'] = function(e, item, direction){
        let note = Object.keys(window.saronKeys).find((x)=>window.saronKeys[x]==item);
        if(!note || e.repeat) return;
        noteTrigger('saron',note,direction?'on':'off')
    }
}

export default setKeyboard;