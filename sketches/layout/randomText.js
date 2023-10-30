function randomText(numberOfLines = 1000, text = 'the quick brown fox jumps over the lazy dog'){
    let content = document.querySelector('#message');
    if(!content) return;
    let message = text;
    let scrambledMessage = scramble(message);
    for(let i=0;i<numberOfLines;i++) {
        scrambledMessage = scramble(scrambledMessage);
        content.innerHTML += scrambledMessage + '<br>';
    }
}

    
function scramble(message) {
    let scrambled = '';
    let chars = message.split('');
    while(chars.length > 0) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        scrambled += chars[randomIndex];
        chars.splice(randomIndex, 1);
    }
    return scrambled;
}
    
export default randomText;