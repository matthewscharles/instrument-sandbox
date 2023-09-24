import generateSelector from './generateSelector.js';

function assignClasses(){
    document.querySelectorAll(generateSelector('hc')).forEach((element)=>{
        let noteName = element.id.replace('_Imageremove_hc','');
        let classes = [ noteName,
                        'note',
                        'hc',
                        'saron',
                        'pelog'
                      ]; 
        element.classList.add('note', ...classes);
        element.querySelectorAll('path').forEach((y,i)=>{
            y.classList.add('note', ...classes);
            y.id = `${'saron'}_${'pelog'}_${noteName}_hc_${i}`;
            y.dataset.note = noteName;
            y.dataset.instrument = 'saron';
        })
    });
    
    document.querySelectorAll(generateSelector('Image')).forEach((element)=>{
        let noteName = element.id.replace('_Image','');
        let classes = [ noteName,
                        'note',
                        'saron',
                        'pelog'
                    ]
        element.classList.add('note', ...classes);
        let newSVG = element.parentElement.cloneNode(false);
        let container = element.parentElement.parentElement || document.body;
        newSVG.classList.remove('background');
        newSVG.appendChild(element)
        container.appendChild(newSVG);
        newSVG.classList.add('note','display','saron','pelog',noteName);
    });
}

export default assignClasses