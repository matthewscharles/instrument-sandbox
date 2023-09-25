/**
 * 
 * @param {HTMLElement} element element upon which to perform the transition
 * @param {boolean} display trigger appearance or disappearance of element
 * @param {number} delay transition time in ms
 */

function transitionDisplay(element, display=false, delay=1000, laras='slendro') {
    laras = element.classList.contains('slendro')?'slendro':'pelog';
    window.larasTimeouts = window.larasTimeouts || {
        slendro: null,
        pelog: null
    };
    
    if (display) {
        element.classList.remove('transparent');
        element.classList.remove('nodisplay');
        clearTimeout(window.larasTimeouts[laras]);
    } else {
        element.classList.add('transparent');
        window.larasTimeouts[laras] = setTimeout(() => {
            element.classList.add('nodisplay');
        }, delay);
    }
}

export default transitionDisplay;