import noteTransition from '../note_animation/noteTransition.js';

// tuning based on a toy saron

let tuning = {
    slendro:{
        "M1":0.73,
        "M2":0.83,
        "M3":0.96,
        "M5":1.09,
        "M6":1.27
    },
    pelog:{
        "M1":0.8,
        "M2":0.85,
        "M3":0.94,
        "M4":1.12,
        "M5":1.21,
        "M6":1.27,
        "M7":1.398                
    }
}

tuning.slendro.H1 = tuning.slendro.M1*2;

export default function setSamplers(){
    window.players = [...new Array(6)].map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
    window.players.forEach((x,i)=>{
        x.playbackRate = Object.values(tuning.slendro)[i];
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
    window.addEventListener('displayNote',noteTransition)
    
}
