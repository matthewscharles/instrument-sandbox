import * as Tone from "tone";
import * as dat from "dat.gui";
import MultitouchMapper from "@matthewscharles/multitouch-mapper";
import KeyboardMapper from "keyboard-mapper";
import MidiMapper from "midi-mapper";
// import CM from "@matthewscharles/cm-toolbox"
import { Layout } from "@matthewscharles/layout"


Object.assign(window, {
    Layout,
    Tone,
    dat
});

Tone.start();

window.touchMapper = new MultitouchMapper();
window.keyboardMapper = new KeyboardMapper(false);
window.midi = new MidiMapper();

window.mapper = {
    touch: touchMapper,
    keyboard: keyboardMapper,
    midi: midi
}