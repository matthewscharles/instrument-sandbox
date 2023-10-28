window.addEventListener('load',()=>{
    let content = document.querySelector('#message');
    let message = 'the quick brown fox jumps over the lazy dog';
    let scrambledMessage = scramble(message);
    for(let i=0;i<1000;i++) {
        scrambledMessage = scramble(scrambledMessage);
        content.innerHTML += scrambledMessage + '<br>';
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
})
        
window.addEventListener('resize',()=>{
    document.querySelector('.modal__content').style.marginTop = document.querySelector('.modal__banner').offsetHeight + 10 + 'px';
})