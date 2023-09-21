function noteTrigger(instrument, pitch, type){
    const event = new CustomEvent('note',{
        detail:{
            instrument,pitch,type   
        }
    });
    
    window.dispatchEvent(event);
}

export default noteTrigger;