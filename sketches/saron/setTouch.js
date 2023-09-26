import setLaras from './setLaras.js';
import noteTrigger from './noteTrigger.js';

/**
 * this needs to be rewritten as a priority.
 */

const actions = {
    '.hc': function(element,type,query){
        let gestureTypes = ['start','end','leave'];
        if(localStorage.getItem('glide')=='true') gestureTypes.push('enter');
        if(!gestureTypes.includes(type)) return;
        noteTrigger(
            element.dataset.instrument,
            element.dataset.note,
            type=='start'||type=='enter'?'on':'off',
            element.classList.contains('pelog')?'pelog':'slendro'
        );      
    },
    '.options': function(element,type,query){
        let paths = document.querySelectorAll(`.${element.id} path`);
        let items = {
            'options__laras': function(laras){
                laras = laras ? 'pelog' : 'slendro';
                setLaras(laras);
            },
            'options__glide': function(glide){
                localStorage.setItem('glide',glide);
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
                let elementIsOn = element.classList.contains('on');
                if(items[element.id]) items[element.id](elementIsOn);
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