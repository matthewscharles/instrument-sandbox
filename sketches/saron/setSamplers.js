import tuning from './tuning.js';

/**
 * Set the samplers for the saron
 * @param {string} laras
 * @param {string} source
 * @memberof saron
 */

const setSamplers = function(laras="slendro", source="toy_saron"){
    if(source=="toy_saron") {
        tuning.toy_saron.slendro.H1 = tuning.toy_saron.slendro.M1*2
    }
    
    let numberOfNotes = Object.keys(tuning[source][laras]).length;
    window.players = window.players || {};
    window.players[laras] = [...new Array(numberOfNotes)]
        .map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
    window.players[laras].forEach((x,i)=>{
        x.playbackRate = Object.values(tuning[source][laras])[i];
        x.onstop = function(){  
            /**
             * note: this has been removed because the sampler retriggering causes a note off event to be triggered.
             * we could possibly remove the timeOut here, but right now this is not top priority
             */
            
            // window.setTimeout(()=>{
            //     const event = new CustomEvent('displayNote', {
            //         detail:{
            //             type:'off',
            //             pitch:Object.keys(tuning.slendro)[i],
            //             instrument:'saron',
            //             player:x.state
            //         }
            //     });
            //     window.dispatchEvent(event);
            // },1);
        }
    })
    // quick transposition: players.forEach(player=>{player.playbackRate = player.playbackRate/2})
    
    
}

export default setSamplers;