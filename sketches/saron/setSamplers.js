import noteTransition from '../note_animation/noteTransition.js';

let tuning = {
    slendro:{
        "M1":0.73,
        "M2":0.83,
        "M3":0.96,
        "M5":1.09,
        "M6":1.27
    }
}

tuning.slendro.H1 = tuning.slendro.M1*2;

export default function setSamplers(){
    window.players = [...new Array(6)].map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
    window.players.forEach((x,i)=>{
        x.playbackRate = Object.values(tuning.slendro)[i];
        x.onstop = function(){  
            window.setTimeout(()=>{
                const event = new CustomEvent('displayNote', {
                    detail:{
                        type:'off',
                        pitch:Object.keys(tuning.slendro)[i],
                        instrument:'saron',
                        player:x.state
                    }
                });
                window.dispatchEvent(event);
            },1);
        }
    })
    // quick transposition: players.forEach(player=>{player.playbackRate = player.playbackRate/2})
    window.addEventListener('displayNote',noteTransition)
    
}
