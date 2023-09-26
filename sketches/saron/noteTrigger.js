function noteTrigger(instrument, pitch, type, laras=window.laras){
    const event = new CustomEvent('note',{
        detail:{
            instrument,pitch,type,laras   
        }
    });
    window.dispatchEvent(event);
}

export default noteTrigger;