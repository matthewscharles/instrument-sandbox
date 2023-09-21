import * as dat from "dat.gui";
import MultitouchMapper from "@matthewscharles/multitouch-mapper";
import KeyboardMapper from "keyboard-mapper";

window.dat = dat;
window.touch = new MultitouchMapper();
window.keyboardMapper = new KeyboardMapper(false);