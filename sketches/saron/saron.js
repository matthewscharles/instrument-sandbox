import { MultitouchMapper } from '../main.js';
import selector from './selector.js';

document.querySelectorAll(selector('hc')).forEach((x)=>{
    let noteName = x.id.replace('_Imageremove_hc','');
    let classes = [ noteName,
                    'note',
                    'hc',
                    'saron',
                    'pelog'
                  ]; 
    x.classList.add('note', ...classes);
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
    newSVG.classList.add('note','display');
});

