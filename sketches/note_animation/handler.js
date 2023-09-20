let glide = false;

function handler(e){
    let {type, target} = e;
    let events = ['pointerdown'];
    if(glide) events.push('pointerenter');
    let value = events.includes(type);
    target.classList[value?'add':'remove']('on');
}

export default handler;