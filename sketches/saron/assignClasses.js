import generateSelector from './generateSelector.js';

function assignClasses(){
    document.querySelectorAll(generateSelector('hc')).forEach((x)=>{
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
    
    document.querySelectorAll(generateSelector('Image')).forEach((x)=>{
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
}

export default assignClasses