/**
 * 
 * @fileoverview The saron namespace indicates project-specific functions.
 * @namespace saron
 */

// Imports ---

import { replaceSvgAll } from './replaceSvgObject.js';
import init from './init.js';

// -----------

window.addEventListener('load', () => {
    replaceSvgAll();
    init();
});


