 import {replaceSvgObject} from './replaceSvgObject.js';
 
    document.querySelectorAll('.svg-import').forEach(element => {
        // I'm not sure how this will work with loading the SVGs from the server, so here's a first attempt.
        if(element.contentDocument) {
            replaceSvgObject(element);
        } else {
            element.addEventListener('load', () => {
                replaceSvgObject(element);
            });
        }
    });
    
