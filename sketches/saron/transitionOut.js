function transitionOut(element, delay = 1000) {
    element.classList.add('transparent');
    setTimeout(() => {
        element.classList.add('nodisplay');
        console.log('transitioned out', element);
    }, delay);
}

export default transitionOut;