/**
 * Note requires the object to be loaded.
 * @param {*} objectElement 
 */

function replaceSvgObject(objectElement) {
    const newSvgElement = objectElement.contentDocument.querySelector('svg');
    
    objectElement.classList.forEach(className => {
        newSvgElement.classList.add(className);
    });
    
    newSvgElement.classList.replace('svg-import', 'svg-imported');
    newSvgElement.id = objectElement.id;
    objectElement.replaceWith(newSvgElement);
}


export { replaceSvgObject }