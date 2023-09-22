import * as dat from "dat.gui";
import MultitouchMapper from "@matthewscharles/multitouch-mapper";
import KeyboardMapper from "keyboard-mapper";
import MidiMapper from "midi-mapper";

window.dat = dat;
window.touchMapper = new MultitouchMapper();
window.keyboardMapper = new KeyboardMapper(false);
window.midi = new MidiMapper();