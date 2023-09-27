import TouchActions from './TouchActions.js';

/**
 * Respond to the touch-pickup event from the multitouch-mapper.
 */

const setTouch = function(){
    document.addEventListener('touch-pickup', (e)=>{
        Tone.start();
        let {element,type,query} = e.detail;
        if(TouchActions[query]) TouchActions[query](element,type,query);
    })
}

export default setTouch;