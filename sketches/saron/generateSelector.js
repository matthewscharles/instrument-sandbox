/**
 * Get the selector string for different registers (L, M, H) and different SVG elements (e.g. Image, hc)
 * @param {*} ending 
 * @returns {string} selectorString
 */

function generateSelector(suffix='Image', prefix=['L','M','H']) {
    let selectors = [];
    prefix.forEach(p => {
        selectors.push(`[id^="${p}"][id$="_${suffix}"]`);
    });
    return selectors.join(', ');
}

export default generateSelector;