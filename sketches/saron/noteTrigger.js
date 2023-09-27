/**
 * Create and dispatch a custom event to trigger a note on/off
 * @param {string} instrument 
 * @param {string} pitch 
 * @param {string} type 
 * @param {string} laras 
 */

function noteTrigger(instrument, pitch, type, laras=window.laras){
    const event = new CustomEvent('note',{
        detail:{
            instrument,pitch,type,laras   
        }
    });
    window.dispatchEvent(event);
}

export default noteTrigger;