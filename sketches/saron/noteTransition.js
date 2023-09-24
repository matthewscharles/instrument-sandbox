/**
 * 
 * @param {event} e Custom note event
 */

function noteTransition(e){
    let {type, pitch, instrument, laras} = e.detail;
    let value = (type == 'on');
    let query =`.${instrument}.${pitch}.${laras}`;
    document.querySelectorAll(query).forEach((element)=>{
        // if(!window.auto_off && !value) return;
        element.classList[value?'add':'remove']('on');    
    })
}

export default noteTransition;