/**
 * Note requires the object to be loaded.
 * @param {*} objectElement 
 */

function replaceSvgObject(objectElement) {
    const svgContent = objectElement.contentDocument.documentElement.outerHTML;
    
    objectElement.insertAdjacentHTML('afterend', svgContent);
    let newSvgElement = objectElement.nextElementSibling;
    
    objectElement.classList.forEach(className => {
        newSvgElement.classList.add(className);
    });
    
    newSvgElement.classList.replace('svg-import', 'svg-imported');
    newSvgElement.id = objectElement.id;
    objectElement.remove();
}

export { replaceSvgObject }