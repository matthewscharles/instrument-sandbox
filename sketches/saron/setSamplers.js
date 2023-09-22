export default function setSamplers(){
    window.players = [...new Array(6)].map(()=>new Tone.Player(`sounds/H3_lo.mp3`).toDestination());
    window.players.forEach((x,i)=>{
        x.playbackRate = 0.5 + (i/3);
    })
}
