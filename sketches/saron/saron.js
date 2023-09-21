import selector from './selector.js';
document.querySelectorAll(selector('hc')).forEach((x)=>{
    let classes = [ 'note',
                    'hc',
                    x.id.replace('_Imageremove_hc',''),
                    'saron',
                    'pelog'
                  ]; 
    x.classList.add('note', ...classes);
});

document.querySelectorAll(selector('Image')).forEach((x)=>{
    let classes = [ 'note',
                    x.id.replace('_Image',''),
                    'saron',
                    'pelog'
                ]
    x.classList.add('note', ...classes);
    console.log(x.parentElement)
    let newSVG = x.parentElement.cloneNode(false);
    newSVG.appendChild(x)
    document.body.appendChild(newSVG);
    newSVG.classList.add('note', 'on');
});

