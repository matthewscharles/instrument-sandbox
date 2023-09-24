function setGui(){
    let midiNoteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
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
        text_colour_on:[255,0,0],
        midi_map:{
            slendro:{
                "1":'C#',
                "2":'D#',
                "3":'F#',
                "5":'G#',
                "6":'A#'        
            },
            pelog:{
                "1":'C',
                "2":'D',
                "3":'E',
                "4":'F',
                "5":'G',
                "6":'A',
                "7":'B'
           }
        },
        tuning:{
            slendro:{
                "1":0.73,
                "2":0.83,
                "3":0.96,
                "5":1.09,
                "6":1.27
            },
            pelog:{
                "1":0.8,
                "2":0.85,
                "3":0.94,
                "4":1.12,
                "5":1.21,
                "6":1.27,
                "7":1.398                
            }
        }
    }
    
    
    Object.entries(properties.midi_map.slendro).forEach(([key,value],i)=>{
        properties.tuning.slendro[key] = window.players[i].playbackRate;
    })
    
    // console.table(properties.tuning.slendro);
    
    window.gui = new dat.GUI();
    
    let noteDisplayFolder = gui.addFolder('note display');
    let optionsFolder = gui.addFolder('options');
    let midiFolder = gui.addFolder('MIDI');
    let tuningFolder = gui.addFolder('tuning');

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
    
    Object.keys(properties.midi_map.slendro).forEach((note)=>{
        midiFolder.add(properties.midi_map.slendro, note, midiNoteNames)
            .onChange((x)=>{
                let num = midiNoteNames.indexOf(x);
                console.log(num, Object.keys(properties.midi_map.slendro).indexOf(note));
                window.midiNotes[Object.keys(properties.midi_map.slendro).indexOf(note)] = num;
                console.log('midiNotes: ',window.midiNotes)
            });
    })
    
    Object.keys(properties.tuning.slendro).forEach((note)=>{
        tuningFolder.add(properties.tuning.slendro, note, 0.5, 2)
            .step(0.001)
            .onChange((x)=>{
                window.players[Object.keys(properties.tuning.slendro).indexOf(note)].playbackRate = x;
            });
    })
    
    gui.close();
    gui.domElement.classList.add('allowDefault');
}

export {setGui};