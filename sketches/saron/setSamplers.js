import noteTransition from '../note_animation/noteTransition.js';
import tuning from './tuning.js';

tuning.toy_saron.slendro.H1 = tuning.toy_saron.slendro.M1*2;

export default function setSamplers(laras="slendro", source="toy_saron"){
    let numberOfNotes = Object.keys(tuning[source][laras]).length;
    window.players = window.players || {};
    window.players[laras] = [...new Array(numberOfNotes)]
        .map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
    window.players[laras].forEach((x,i)=>{
        x.playbackRate = Object.values(tuning[source][laras])[i];
        x.onstop = function(){  
            /**
             * note: this has been removed because the sampler retriggering causes a note off event to be triggered
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
