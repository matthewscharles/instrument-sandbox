import noteTrigger from '../note_trigger/note_trigger.js';

const actions = {
    '.hc': function(element,type,query){
        if(!['start','enter','end','leave'].includes(type)) return;
        noteTrigger(element.dataset.instrument,element.dataset.note,type=='start'||type=='enter'?'on':'off');        
    },
    '.options': function(element,type,query){
        if(!['end'].includes(type)) return;
        document.querySelector(`.${element.id} path`).classList.toggle('on');
    }
}

export default function setTouch(){
    document.addEventListener('touch-pickup', (e)=>{
        Tone.start();
        let {element,type,query} = e.detail;
        if(actions[query]) actions[query](element,type,query);
    })
}