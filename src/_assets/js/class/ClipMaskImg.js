import BezierEasing from './BezierEasing.esm';
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin( SplitText);

export class ClipMaskImg {
    constructor( opts ){
        const defaults = {
            maskTime: 1,
            maskEase: BezierEasing(0.9,0,0.1,1), 
            imgTime: 1.4,
            imgDelayTime: 0,
            imgEase: BezierEasing(0.4,0,0.2,1),
        }

        this.opts = {...defaults, ...opts};
        this.maskTime = this.opts.maskTime;
        this.maskEase = this.opts.maskEase;
        this.imgTime = this.opts.imgTime;
        this.imgDelayTime = this.opts.imgDelayTime;
        this.imgEase = this.opts.imgEase;

        this.wordElem = this.opts.wordElem;  
        this.wordTime = this.opts.wordTime;
        this.wordEase = this.opts.wordEase;    

        // this._set()
    }

    _set(){
        let _path;
        if(this.opts.clipPosition === 'left'){
            _path = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
        } else if(this.opts.clipPosition === 'center'){
            _path = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)' 
        }
        gsap.set(this.opts.maskElem, {clipPath: _path} )
        gsap.set(this.opts.imgElem, {scale: 2} )

        if(this.wordElem === undefined) return;
        const charGap = this.opts.charGap;
        this.split = new SplitText( this.wordElem , { 
            type: "words, chars", 
            position: 'absolute' 
        });
        
        const centerIndex = Math.ceil(this.split.chars.length/2);
        this.split.chars.forEach((txt, i )=>{
            if( this.split.chars.length % 2 != 0){
                gsap.set(txt, {x: (i-(centerIndex-1))*charGap })
            } else {
                let n = (i<centerIndex) ? i-centerIndex : i-(centerIndex-1)
                gsap.set(txt, {x: n * charGap })
            }
        })
        gsap.set(this.split.words, {scale: 2 })
    }

    play(){
        // webkitClipPath
        gsap.to( this.opts.maskElem, this.maskTime, { ease: this.maskEase, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'} )
        gsap.to( this.opts.imgElem, this.imgTime, {delay:this.imgDelayTime, ease: this.imgEase, scale: 1} )
        
        if(this.wordElem === undefined) return;
        gsap.to( this.split.words, this.wordTime, {delay:this.imgDelayTime, scale: 1, ease: this.wordEase })
        gsap.to( this.split.chars, this.wordTime, {delay:this.imgDelayTime, x: 0, ease: this.wordEase })
    }
};

