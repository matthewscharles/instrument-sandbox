/**
 * Note requires the object to be loaded.
 * @param {*} objectElement 
 */

function replaceSvgObject(objectElement) {
    let newSvgElement = objectElement.contentDocument.querySelector('svg');
    if (!newSvgElement) {
        
        setTimeout(() => {
            console.log('svg not loaded, waiting.to try again..')
            replaceSvgObject(objectElement);
        }, 100);
        return;
    }
    
    console.log(`loaded from ${objectElement.id}`)
    
    objectElement.classList.forEach(className => {
        newSvgElement.classList.add(className);
    });
    
    newSvgElement.classList.replace('svg-import', 'svg-imported');
    
    newSvgElement.id = objectElement.id;
    objectElement.replaceWith(newSvgElement);
}


export { replaceSvgObject }