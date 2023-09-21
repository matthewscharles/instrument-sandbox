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

function setGui(){
    let noteDisplay = Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.note.display');
    let noteDisplayOn = Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.note.display.on');
    let textDisplay = Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.text');
    let textDisplayOn = Array.from(document.styleSheets[0].rules).find(x=>x.selectorText=='.text.on');

    let properties = {
        brightness:80,
        brightness_on:150,
        time:3,
        time_on:0.1,
        high_contrast:false,
        text_size:2,
        text_colour:[0,0,0],
        text_colour_on:[255,0,0]
    }

    window.gui = new dat.GUI();
    let noteDisplayFolder = gui.addFolder('note display');
    let optionsFolder = gui.addFolder('options');

    noteDisplayFolder.add(properties,'brightness').name('brightness (off)').min(0).max(100).onChange((x)=>{
        noteDisplay.style.filter = `brightness(${x}%)`;
    });
    noteDisplayFolder.add(properties,'brightness_on').name('brightness (on)').min(0).max(200).onChange((x)=>{
        noteDisplayOn.style.filter = `brightness(${x}%)`;
    });
    noteDisplayFolder.add(properties,'time').name('time (off)').min(0).max(10).step(0.1).onChange((x)=>{
        noteDisplay.style.transition = `filter ${x}s`;
    });
    noteDisplayFolder.add(properties,'time_on').name('time (on)').min(0).max(2).step(0.01).onChange((x)=>{
        noteDisplayOn.style.transition = `filter ${x}s`;
    });

    optionsFolder.add(properties,'high_contrast').name('high contrast').onChange((x)=>{
        document.querySelectorAll('.background').forEach(element=>element.classList[x?'add':'remove']('contrast'));
    })
    optionsFolder.add(properties,'text_size').name('text size').min(0.5).max(3.5).step(0.1).onChange((x)=>{
        textDisplay.style.fontSize = `${x}em`;
    })
    optionsFolder.addColor(properties,'text_colour').name('text colour').onChange((x)=>{
        textDisplay.style.backgroundColor = `rgba(${x[0]},${x[1]},${x[2]},1)`;
    })
    optionsFolder.addColor(properties,'text_colour_on').name('text colour (on)').onChange((x)=>{
        textDisplayOn.style.backgroundColor = `rgba(${x[0]},${x[1]},${x[2]},1)`;
    })
}

window.setGui = setGui;