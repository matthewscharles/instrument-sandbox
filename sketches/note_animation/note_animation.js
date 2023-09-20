let listenerTypes = ['pointerdown','pointerup','pointerleave','pointerenter'];
let glide = false;

function handler(e){
    let {type, target} = e;
    let events = ['pointerdown'];
    if(glide) events.push('pointerenter');
    let value = events.includes(type);
    target.classList[value?'add':'remove']('on');
}

document.querySelectorAll('.note').forEach((note,i)=>{
    // note.style.setProperty('--note',i);
    listenerTypes.forEach((x)=>{
        note.addEventListener(x,handler)
    })
})
