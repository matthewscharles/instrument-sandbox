import {replaceSvgObject} from './replaceSvgObject.js';
 
document.querySelectorAll('.svg-import').forEach(element => {
    if(element.contentDocument) {
        replaceSvgObject(element);
    } else {
        element.addEventListener('load', () => {
            replaceSvgObject(element);
        });
    }
});
    
