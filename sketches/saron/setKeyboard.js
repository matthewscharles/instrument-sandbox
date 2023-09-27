import noteTrigger from './noteTrigger.js';

/**
 * Set keyboard mapping for the saron, using the external keyboardMapper library
 */

const setKeyboard = function(){
    window.saronKeys = {
        slendro:{
            M1: 'A',
            M2: 'S',
            M3: 'D',
            M5: 'F',
            M6: 'G',
            H1: 'H'    
        },
        pelog:{
            M1: 'A',
            M2: 'S',
            M3: 'D',
            M4: 'F',
            M5: 'G',
            M6: 'H',
            M7: 'J'
        }
    }
    
    keyboardMapper.keymap['Key'] = function(e, item, direction){
        let note = Object.keys(window.saronKeys[window.laras]).find((x)=>window.saronKeys[window.laras][x]==item);
        if(!note || e.repeat) return;
        noteTrigger('saron',note,direction?'on':'off')
    }
}

export default setKeyboard;