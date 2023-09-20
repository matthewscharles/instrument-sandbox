/**
 * 
 * @param {event} e Custom note event
 */

function noteTransition(e){
    let {type, pitch, instrument} = e.detail;
    let value = (type == 'on');
    let query =`.${instrument}.${pitch}`;
    document.querySelectorAll(query).forEach((element)=>{
        element.classList[value?'add':'remove']('on');    
    })
}

export default noteTransition;