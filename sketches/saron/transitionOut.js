/**
 * 
 * @param {HTMLElement} element element upon which to perform the transition
 * @param {boolean} display trigger appearance or disappearance of element
 * @param {number} delay transition time in ms
 */

function transitionDisplay(element, display=false, delay = 1000) {
    delay = display ? 0 : delay;
    let action = display ? 'remove' : 'add';
    element.classList[action]('transparent');
    setTimeout(() => {
        element.classList[action]('nodisplay');
    }, delay);
}

export default transitionDisplay;