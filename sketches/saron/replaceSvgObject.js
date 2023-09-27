/**
 * Replace an object element with its svg content, inline.
 * If the object has not loaded yet, try again every 100ms
 * Match folders if not in root (basic implementation)
 * @param {HTMLElement} objectElement 
 */

function replaceSvgObject(objectElement) {
    let newSvgElement = objectElement.contentDocument.querySelector('svg');
    if (!newSvgElement) {
        setTimeout(() => {
            if(window.verbose) console.log(`svg not loaded (${objectElement.id}), waiting.to try again..`)
            replaceSvgObject(objectElement);
        }, 100);
        return;
    }
    
    if(window.verbose) console.log(`svg loaded from ${objectElement.id}`);
    
    // replace SVG folder name ...
    let folder = objectElement.getAttribute('data').split('/');
    if(folder.length>1){
        folder.pop(); 
        folder = folder.join('/');
        newSvgElement.querySelectorAll('image').forEach(image=>{
            let href = image.getAttribute('href') || image.getAttribute('xlink:href');
            image.removeAttribute('xlink:href');
            image.setAttribute('href', `${folder}/${href}`);
        });
    }
    
    objectElement.classList.forEach(className => {
        newSvgElement.classList.add(className);
    });
    
    newSvgElement.classList.replace('svg-import', 'svg-imported');
    
    newSvgElement.id = `${objectElement.id}`;
    objectElement.replaceWith(newSvgElement);
}


export { replaceSvgObject }