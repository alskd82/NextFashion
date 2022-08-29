import { gsap } from "gsap";

const Loading = (function(exports){
    const elem = document.querySelector('#LoadWrap');
    const spanBig = elem.querySelector('.load-text.big div');
    const spanSmall = elem.querySelector('.load-text.small div');
    const overlayPath = elem.querySelector('.overlay_path');

    function init(){
        gsap.set(spanBig, {y: 75} )
        gsap.set(spanBig.querySelectorAll('span'), {y: -150} )
        gsap.set(spanBig.parentElement, {opacity: 1})
        // gsap.set(elem, {clipPath: '0% 0%, 100% 0%, 100% 100%, 0% 100%'})
    }
    init();

    function play(){
        const span = spanSmall.querySelectorAll('span');
        span.forEach(elem => {
            elem.classList.remove('load')
            elem.style.animation = 'ani'
        });
        gsap.to(spanSmall, .6, {y: -50, ease: 'Quint.easeOut'})
        gsap.to(span, .6, {y: 100, ease: 'Quint.easeOut'});
        gsap.to(spanBig, .6, {delay: .1, y: 0, ease: 'Quint.easeOut'} )
        gsap.to(spanBig.querySelectorAll('span'), .6, {delay: .1, y: 0, ease: 'Quint.easeOut' } )
        gsap.delayedCall(0.3, overlay_play )
    }

    function overlay_play(){
        gsap.timeline()
            .set(overlayPath, { attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' } })
            .to(overlayPath, 0.6, { ease: 'Quint.easeIn', attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' } }, 0)
            .to(overlayPath, 0.3, {  ease: 'Cubic.easeOut', attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
                onComplete: () => {
                    elem.style.backgroundColor = 'rgba(0,0,0,0)';
                    elem.querySelectorAll('div').forEach(elem => elem.remove());
                    if(window.pageYOffset > 0){
                        window.scrollTo(0,0)
                        // setTimeout(()=>{ isRefresh = false;}, 100)
                    }
                }
            })
            .set(overlayPath, { attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' } })
            .to(overlayPath, 0.3 ,{ ease: 'Cubic.easeIn',  attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' } })
            .to(overlayPath, 0.8, {  ease: 'Quint.easeOut', attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }, 
            onComplete: () => {
                    // elem.remove()
                    elem.style.display = 'none';
                }    
        });
    }

    exports = { init, play, overlay_play  }
    return exports;
})({});

export default Loading;