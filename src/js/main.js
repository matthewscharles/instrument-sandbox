import * as Tone from "tone";
import * as dat from "dat.gui";
import  { MultitouchMapper }  from "@matthewscharles/multitouch-mapper";
import { KeyboardMapper } from "keyboard-mapper";
import { MidiMapper } from "midi-mapper";
// import CM from "@matthewscharles/cm-toolbox"

window.touchMapper = new MultitouchMapper();
window.keyboardMapper = new KeyboardMapper(false);
window.midi = new MidiMapper();

Object.assign(window, {
    Tone,
    dat,
    mapper: {
        touch: touchMapper,
        keyboard: keyboardMapper,
        midi: midi
    }
});

Tone.start();