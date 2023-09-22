import * as dat from "dat.gui";
import MultitouchMapper from "@matthewscharles/multitouch-mapper";
import KeyboardMapper from "keyboard-mapper";
import MidiMapper from "midi-mapper";
// import {replaceSvgObject} from "./replaceSvgObject.js";

// document.querySelectorAll('.svg-import').forEach(element => {
//     if(element.contentDocument) {
//         console.log('success')
//         replaceSvgObject(element);
//     } else {
//         console.log('wait')
//         element.addEventListener('load', () => {
//             replaceSvgObject(element);
//         });
//     }
// });

window.dat = dat;
window.touchMapper = new MultitouchMapper();
window.keyboardMapper = new KeyboardMapper(false);
window.midi = new MidiMapper();

window.mapper = {
    touch: touchMapper,
    keyboard: keyboardMapper,
    midi: midi
}

