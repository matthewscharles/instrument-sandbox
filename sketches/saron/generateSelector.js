/**
 * Get the selector string for different registers (L, M, H) and different SVG elements (Image, hc)
 * @param {*} ending 
 * @returns {string} selectorString
 */

function generateSelector(ending='Image') {
    let selectorString = `[id^="M"][id$="_${ending}"], [id^="L"][id$="_${ending}"], [id^="H"][id$="_${ending}"]`;
    return selectorString;
}

export default generateSelector;