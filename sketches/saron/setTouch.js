import noteTrigger from '../note_trigger/note_trigger.js';

export default function setTouch(){
    document.addEventListener('touch-pickup', (e)=>{
        Tone.start();
        let {element,type} = e.detail;
        if(!['start','enter','end','leave'].includes(type)) return;
        noteTrigger(element.dataset.instrument,element.dataset.note,type=='start'||type=='enter'?'on':'off')
    })
}