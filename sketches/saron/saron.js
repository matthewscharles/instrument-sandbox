/**
 * @fileoverview This file contains the main script for the saron sketch.
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


