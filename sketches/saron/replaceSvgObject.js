/**
 * If object is not loaded, try again every 100ms
 * @param {HTMLElement} objectElement 
 */

function replaceSvgObject(objectElement) {
    let newSvgElement = objectElement.contentDocument.querySelector('svg');
    if (!newSvgElement) {
        setTimeout(() => {
            console.log(`svg not loaded (${objectElement.id}), waiting.to try again..`)
            replaceSvgObject(objectElement);
        }, 100);
        return;
    }
    
    if(window.verbose) console.log(`svg loaded from ${objectElement.id}`);
    
    objectElement.classList.forEach(className => {
        newSvgElement.classList.add(className);
    });
    
    newSvgElement.classList.replace('svg-import', 'svg-imported');
    
    newSvgElement.id = objectElement.id;
    objectElement.replaceWith(newSvgElement);
}


export { replaceSvgObject }