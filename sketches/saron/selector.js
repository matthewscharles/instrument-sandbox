/**
 * 
 * @param {*} ending 
 * @returns {string} selectorString
 */

function selector(ending='Image') {
    let selectorString = `[id^="M"][id$="_${ending}"], [id^="L"][id$="_${ending}"], [id^="H"][id$="_${ending}"]`;
    return selectorString;
}

export default selector;