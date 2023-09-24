import setLaras from './setLaras.js';
import noteTrigger from '../note_trigger/note_trigger.js';

const actions = {
    '.hc': function(element,type,query){
        if(!['start','enter','end','leave'].includes(type)) return;
        noteTrigger(element.dataset.instrument,element.dataset.note,type=='start'||type=='enter'?'on':'off',element.classList.contains('pelog')?'pelog':'slendro');      
    },
    '.options': function(element,type,query){
        let paths = document.querySelectorAll(`.${element.id} path`);
        let items = {
            'options__laras': function(laras){
                setLaras(laras);
            }
        }
        let actions = {
            'start':function(){
                paths.forEach(path=>path.classList.add('active'));
            },
            'enter': function(){
                paths.forEach(path=>path.classList.add('active'));
            },
            'leave': function(){
                paths.forEach(path=>path.classList.remove('active'));
            },
            'end': function(){
                paths.forEach(path=>path.classList.remove('active'));
                element.classList.toggle('on');
                paths.forEach(path=>path.classList.toggle('on'));
                if(items[element.id]) items[element.id](element.classList.contains('on')?'pelog':'slendro');
            }
        }
        
        if(actions[type]) actions[type]();
        
    }
}

export default function setTouch(){
    document.addEventListener('touch-pickup', (e)=>{
        Tone.start();
        let {element,type,query} = e.detail;
        if(actions[query]) actions[query](element,type,query);
    })
}