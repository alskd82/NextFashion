import BezierEasing from './BezierEasing.esm';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin( SplitText);

export class LetterSpacing {
    constructor( opts ){
        if(opts.wordElem === undefined) return;
        const defaults = {
            easing: BezierEasing(0.6,0,0.1,1),
            time: 1.3,
            delayTime:0,
            charGap: 450,
            charScale: 1,
            wordScale: 2
        }
        this.opts = {...defaults, ...opts};
        this.wordElem = this.opts.wordElem;
        // this._set()
    }
    
    _set(){
        this.split = new SplitText( this.wordElem , { 
            type: "words, chars", 
            position: 'absolute' 
        });

        // console.log(this.split.chars )
        // console.log(this.split.words )
        
        this.split.chars.forEach((txt, i)=>{
            if(i < 4){ // NEXT
                gsap.set( txt, {x: this.opts.charGap*(i-2), scale: this.opts.charScale, opacity:0 }) //2: NEXT 센터 인덱스
            } else {  // FASHION
                gsap.set( txt, {x: this.opts.charGap*(i-2-4), scale: this.opts.charScale, opacity:0 })//2-4: FASHION 센터 인덱스
            }
        })
        // gsap.set( this.split.words, { scale: this.opts.wordScale })
        gsap.set( '.next-fashtion-txt', { scale: this.opts.wordScale  })
    }

    play(){
        // gsap.to( this.split.words, this.opts.time, {delay:this.opts.delayTime, scale: 1, ease: this.opts.easing })
        gsap.to( '.next-fashtion-txt', this.opts.time, {scale: 1 , ease: this.opts.easing })
        gsap.to( this.split.chars, this.opts.time, {delay:this.opts.delayTime, scale: 1, x: 0, ease: this.opts.easing });
        gsap.to( this.split.chars, this.opts.time * .7, {delay:this.opts.delayTime, opacity: 1 })
    }
    
}