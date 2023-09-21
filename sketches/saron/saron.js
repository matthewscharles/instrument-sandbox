// import { MultitouchMapper } from '../main.js';
import selector from './selector.js';
import noteTransition from '../note_animation/noteTransition.js';

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
document.addEventListener('touch-pickup', (e)=>{
    let {element,type} = e.detail;
    if(!['start','enter','end','leave'].includes(type)) return;
    noteTransition({detail:{
        type:type=='start'||type=='enter'?'on':'off',
        pitch:element.dataset.note,
        instrument:element.dataset.instrument
    }})
})