import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

import lottie from 'lottie-web'
import path_textMastking from "./path/section-desc_text.json"
import path_m_plane from "./path/m_plane.json"

import BezierEasing from './class/BezierEasing.esm';

import {ClipMaskImg} from "./class/ClipMaskImg"

import {ShowDetail} from "./class/m_ShowDetail";

import Loading from "./class/Loading";

function getSafeArea() {
    var result, computed, div = document.createElement('div');

    div.style.padding = 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
    document.body.appendChild(div);
    computed = getComputedStyle(div);
    result = {
        top: parseInt(computed.paddingTop) || 0,
        right: parseInt(computed.paddingRight) || 0,
        bottom: parseInt(computed.paddingBottom) || 0,
        left: parseInt(computed.paddingLeft) || 0
    };
    document.body.removeChild(div);
    return result;
}

function modulate (value, rangeA, rangeB, limit) {
    var fromHigh, fromLow, result, toHigh, toLow;
    if (limit == null) limit = false;
    (fromLow = rangeA[0]), (fromHigh = rangeA[1]);
    (toLow = rangeB[0]), (toHigh = rangeB[1]);
    result =
      toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
    if (limit === true) {
        if (toLow < toHigh) {
            if (result < toLow) return toLow;
            if (result > toHigh) return toHigh;
        } else {
            if (result > toLow) return toLow;
            if (result < toHigh) return toHigh;
        }
    }
    return result;
};



const body = document.body;
const billboard = document.querySelector('.billboard');
const naviList = document.querySelector('.m_navi-list');
const btn_ham = document.querySelector('.m_ham');


let loader;
let Detail;
const scrollType = 'window' // 'element'; // 'window'
let scrollY = (scrollType === 'window') ? window.pageYOffset : document.querySelector('.m_page-wrap').scrollTop;
const scrollTriggerScroller = (scrollType === 'window') ? window : '.m_page-wrap';

// ScrollTrigger.normalizeScroll(false)
ScrollTrigger.config({ ignoreMobileResize: true})

document.addEventListener('DOMContentLoaded', e =>{

    

    /* ---- 랜딩 애니메이션 ------------ */
    let imgCount = 0;
    let imgLoad = imagesLoaded('.billboard',{background: '.billboard-img'} );

    imgLoad.on( 'progress', function(instance, image) {
        let result = image.isLoaded ? 'loaded' : 'broken';
        console.log( 'image is ' + result + ' for ' + image.img.src );
        imgCount++
        if(imgCount === imgLoad.images.length){
            console.log('billboard images loaded')
            gsap.delayedCall(1, landing );
        }
    });
    
    function landing(){
        Loading.play()
        setTimeout(() => {
            document.body.classList.add('loaded');
            Billboard.play();
        }, 1000);
    }
    // ---------------------------------------------------- //


    Floating.init();

    Billboard.init()
    // Billboard.play()
    Billboard.ST();

    Section_Desc.init()
    Secction_Apply.init();
    Secction_LYB.init();
    Section_Step.init();
    Section_Next.init();
    Section_List.init();
    Section_Contact.init();


    addEvent();
    /* 지원서 다운로드 링크 */
    function download_Fn(e){
        e.preventDefault()
        window.open('about:blank').location.href = document.querySelector('#DonwloadURL').getAttribute('href'); 
    }
    document.querySelector('.m_float-download').addEventListener('click', download_Fn, false);
    document.querySelector('.m_btn_download').addEventListener('click', download_Fn, false);
    
    /* 이메일 바로가기 */
    document.querySelector('.m_txt_email-underline').addEventListener('click', ()=> goToEmail() )
    document.querySelector('.m_map_txt-item_t3').addEventListener('click', ()=> goToEmail() )
    const goToEmail =()=> document.location.href = 'mailto:nextfashion@musinsapartners.com';

})

window.addEventListener('load', (e)=>{
    Detail = new ShowDetail();
    Detail.init()
})

/* ====================================================================================================================*/
/* Event */
function addEvent(){

    /* 스크롤 */
    scroll_Fn();
    if(scrollType === 'window') document.addEventListener('scroll', scroll_Fn, false)
    else                        document.querySelector('.m_page-wrap').addEventListener('scroll', scroll_Fn, false)

    /* GNB */
    GNB.init();
    

    /* 상세 */
    document.querySelectorAll('.winner-link').forEach((link, i)=>{
        link.addEventListener('click', e =>{
            e.preventDefault();
            let href = link.getAttribute('href');

            Detail.pageShow(href);
            isGNBShow = true;
            _bodyScrollY = window.pageYOffset;
            body.classList.add('detail-show')
            bodyBlock(true);
        })
    })

    /* 상세 닫기 */
    document.querySelector('.m_detail-gnb a').addEventListener('click' , e =>{
        Detail.closePage();
        isGNBShow = false;
        window.scrollTo(0, _bodyScrollY);
        body.classList.remove('detail-show')
        bodyBlock(false);
    })

     /* 로고 이동 */
    document.querySelector('.m_logo-wrap').addEventListener('click', e =>{
        // window.open('about:blank').location.href = "https://www.musinsapartners.co.kr/";
        // window.location.reload();
        document.querySelector('#LoadWrap').style.display = 'block';
        Loading.overlay_play();
        // isRefresh = true;
    })

    /* 스크롤 다운 */
    document.querySelector('.scroll-arrow-wrap').addEventListener('click', e =>{
        gsap.to(scrollTriggerScroller, .7, {
            scrollTo: {y: ".m_section-banner", offsetY: gsap.getProperty('nav', 'height')}, 
            ease: BezierEasing(0.4,0,0.2,1)
        })
    })

}


/* ====================================================================================================================*/
/* bodyScrollY  */

let _bodyScrollY = window.pageYOffset;
function bodyBlock(isBlock){
    if(scrollType != 'window') return;
    if(isBlock){
        _bodyScrollY = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${_bodyScrollY}px`;
        body.style.width = '100%';
        
    } else {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        body.style.removeProperty('width');
        window.scrollTo(0, _bodyScrollY);
        
    }
}

/* ====================================================================================================================*/
/* scroll */
function scroll_Fn(e){
    scrollY = (scrollType === 'window') ? window.pageYOffset : document.querySelector('.m_page-wrap').scrollTop
    
    const _s = Math.floor(100*vh) *.25
    const _e = Math.floor(100*vh) *.75
    const _opa = modulate(scrollY, [_s,_e], [1,0], true).toFixed(2)
    gsap.set(billboard, {autoAlpha: _opa})

    if(!isGNBShow){
        if(scrollY > _e){
            if(!document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.add('bg-black')
        } else {
            if(document.querySelector('.m_gnb-wrap').classList.contains('bg-black')) document.querySelector('.m_gnb-wrap').classList.remove('bg-black')
        }

        /* 플로팅 위치 */
        if(scrollY > 88){
            if(!document.querySelector('.m_float-wrap').classList.contains('pb-change')){
                document.querySelector('.m_float-wrap').classList.add('pb-change')
                document.querySelector('.scroll-arrow-wrap').classList.add('hide')
            }
        } else {
            if(document.querySelector('.m_float-wrap').classList.contains('pb-change')){
                document.querySelector('.m_float-wrap').classList.remove('pb-change')
                document.querySelector('.scroll-arrow-wrap').classList.remove('hide')
            }
        }
    };

    // console.log(scrollY)
    // if(document.body.classList.contains('loaded')) print(gsap.getProperty('.m_detail', 'height'))
}

/* ====================================================================================================================*/
/* GNB 네비게이션 */
let isGNBShow = false;
const GNB = (function(exports){
    function init(){
        addEvent()
        // ioGnbBgColor()
    };

    function addEvent(){
        btn_ham.addEventListener('click', e =>{
            if(isGNBShow){
                isGNBShow = false;
                naviList.classList.remove('show');
            } else {
                isGNBShow = true;
                naviList.classList.add('show');
            }
            bodyBlock(isGNBShow);
            svgChange();
        });

        document.querySelector('.m_navi-list').addEventListener('click', e =>{
            if(e.target === document.querySelector('.m_navi-list')){
                naviList.classList.remove('show');
                isGNBShow = false
                bodyBlock(isGNBShow);
                svgChange();
            }
        })

        const targetSections = [
            ".m_section-target",
            ".m_section-step",
            ".m_section-benefit",
            ".m_section-winner",
            ".m_section-faq",
            ".m_section-contact",
            ".m_section-supporters"
        ]
        document.querySelectorAll('.m_navi-list a').forEach((navi, i)=>{ 
            navi.addEventListener('click', e => {
                e.preventDefault();
                naviList.classList.remove('show');
                isGNBShow = false
                bodyBlock(isGNBShow);
                console.log(isGNBShow)
                svgChange();

                let _offset = gsap.getProperty('.m_gnb-wrap', 'height');
                if( targetSections[i] === ".m_section-supporters") _offset = 20
                else if( targetSections[i] === ".m_section-benefit") _offset = -20
                else if( targetSections[i] === ".m_section-winner") _offset = 30
                gsap.to(scrollTriggerScroller, 0, { scrollTo:{ y: targetSections[i] , offsetY: _offset-5} });
            })
        })
    }

    function svgChange(){ // 햄버거 버튼 로띠 제어 //
        if(isGNBShow){
            gnbPath.setDirection(1)
            gnbPath.play();
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "#fff"})
        } else {
            gnbPath.setDirection(-1)
            gnbPath.play()
            gsap.to(btn_ham.querySelectorAll('.path path'), .4, {fill: "rgb(189,255,0)"})
        }
    };

    /* .m_gnb-wrap 배경 색상 화이트로 전환 : 서포터즈  */
    function ioGnbBgColor(){
        const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
        const ioGnb = new IntersectionObserver(( entries, observer )=>{
            entries[0].isIntersecting ? gnbBgWhite_Fn(true) : gnbBgWhite_Fn(false)
        }, ioGnbOptions) 

        function gnbBgWhite_Fn(isWhite){
            if(isWhite) document.querySelector('.m_gnb-wrap').classList.add('bg-white')
            else        document.querySelector('.m_gnb-wrap').classList.remove('bg-white')
        }
        ioGnb.observe( document.querySelector('.m_section-supporters') )
    }
    
    // /* gnb 색상 변화 시점 */
    // const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
    // const ioGnb = new IntersectionObserver(( entries, observer )=>{
    //     entries[0].isIntersecting ? gnbChangeColor_Fn(true) : gnbChangeColor_Fn(false)
    // }, ioGnbOptions)
    // // ioGnb.observe( document.querySelector('.section-supporters') )

    exports = {
        init,
    }
    return exports;
})({});

/* ====================================================================================================================*/
/* Floating */
const Floating = (function(exports){
    const floatingDownload = document.querySelector('.m_float-download .ic-download')
    function init(){
        ST()
    }
    
    /* 참가 신청서 색상 바꾸기 */
    function floatingColor_Fn(isChange , isWhite){ 
        // if(!isGNBShow){
            if(isWhite != undefined){
                const _a = floatingDownload.classList.contains('white');
                if(isWhite && !_a) floatingDownload.classList.add('white')
                else if(!isWhite && _a) floatingDownload.classList.remove('white')
            } else {
                const _b = floatingDownload.classList.contains('mode-fill');
                if(isChange && !_b) floatingDownload.classList.add('mode-fill')
                else if(!isChange && _b) floatingDownload.classList.remove('mode-fill')
            }
        // }
    }

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_section-banner',
            start: "bottom bottom",
            onEnter:()=>  floatingColor_Fn(true),
            onLeaveBack:()=> floatingColor_Fn(false)
        });

        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_benefit_txt-wrap',
            start: `top ${window.innerHeight - 24 - 42}px`,
            end: `bottom ${window.innerHeight - 24}px`,
            onEnter:()=>  floatingColor_Fn(true, true),
            onEnterBack:() => floatingColor_Fn(true, true),
            onLeave:() => floatingColor_Fn(true, false),
            onLeaveBack:()=> floatingColor_Fn(true,false)
        });
    }

    exports.init = init;
    return exports;
})({})


/* ====================================================================================================================*/
/* 빌보드 이미지 */
const Billboard = (function(exports){
    let master;
    const _alphaTime = 1.2;
    const _scaleTime = 5;
    const _scale = 1.08;
    const _scaleEase = 'none'
    let imgWraps, imgs;

    function ST(){
        ScrollTrigger.create({
            // markers: true,
            trigger: '.m_section-header .billboard',
            start: 'center center',
            end: "bottom 120px",
            scrub: true,
            animation: gsap.to( '.billboard', 1, {ease: 'none', opacity: 0}) 
        });
    }

    function animation(wrap, img, isJump ){
        let tl = gsap.timeline({})

        tl.set( wrap, {zIndex: 2 }) // 등장할 이미지 래퍼 상단으로 이동

        tl.fromTo( wrap,            // 이미지 래퍼 페이드 인
            {autoAlpha: 0}, 
            {autoAlpha: 1, duration: _alphaTime, 
                onComplete:()=>{
                    gsap.set(wrap, {zIndex:1})  // 등장 완료 후 하단으로 이동
                    if(isJump){                 // 마지막 장면일 때는 루핑 지점으로 점프
                        master.seek( _alphaTime )
                        gsap.set(imgWraps[0], {autoAlpha:1})
                    }
                }
            }
        )

        tl.fromTo( img, 
            {scale: _scale}, 
            {scale: 1, duration: _scaleTime, ease: _scaleEase,  // 이미지 스케일 모션
            onComplete:()=> {                                   // 스케일 모션이 끝나면 래퍼와 함께 원복
                gsap.set(img, {scale: _scale})
                gsap.set(wrap, {autoAlpha: 0})
            }
        }, `=-${_alphaTime}`)
        
        return tl
    }

    const init=()=>{

        imgWraps = gsap.utils.toArray('.billboard .billboard-img-wrap');
        imgs = imgWraps.map( wrap => {
            gsap.set( wrap, {autoAlpha: 0 })
            return wrap.querySelector('.billboard-img')
        });

        master = gsap.timeline({paused: true})
            .add(animation( imgWraps[0], imgs[0], false ))
            .add(animation( imgWraps[1], imgs[1], false ), `=-${_alphaTime}`)
            .add(animation( imgWraps[2], imgs[2], false ), `=-${_alphaTime}`)
            .add(animation( imgWraps[0], imgs[0], true ), `=-${_alphaTime}`)
    }

    const play=()=> master.play()
    const pause=()=> master.pause()

    exports.init = init;
    exports.play = play;
    exports.pause = pause;
    exports.ST = ST;
    return exports;
})({})


/* ====================================================================================================================*/
/* 섹션 : 개요 */
const Section_Desc = (function(exports){
    let img;
    let textMasking;

    function init(){
        img = new ClipMaskImg({
            maskElem: '.m_desc_img-mask',
            imgElem: '.m_desc_img',
            clipPosition: 'left',
            imgDelayTime: 0,
        })
        img._set()
        ST()

        document.querySelector('.m_section-desc .desc_info-txt_strong').style.color = "#fff";
        //--------------------------------------------------------------------------------------
        /* lottie play */
        document.querySelector('.m_desc_info-txt').innerHTML += `<div id="textMasking"></div>`;
        textMasking = lottie.loadAnimation({
            container: document.querySelector('#textMasking'),
            // path: 'https://static.msscdn.net/webflow/static/partners/path/text_masking.json',
            animationData: path_textMastking,
            autoplay: false, loop: false
        });
        //------------------------------------------------------------------------------------------
    }

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_desc_img-wrap',
            start: "top bottom",
            onEnter:()=>{
                img.play()
                setTimeout(()=>{
                    document.querySelector('.m_desc_txt-wrap').classList.add('show')
                }, 300)
            }
        });

        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_desc_info-wrap',
            start: "top 95%",
            onEnter:()=>{
                document.querySelector('.m_desc_info-wrap').classList.add('show')
                setTimeout(()=>{textAnimation()}, 500)
            }
        });
    }

    function textAnimation(){
        textMasking.play();
        setTimeout(()=>{
            document.querySelector('.m_section-desc .desc_info-txt_strong').style.color = "#BDFF00"; 
        },500)
    }
    
    exports.init = init;
    return exports;
})({})

/* ====================================================================================================================*/
/* 섹션 : APPLY */
const Secction_Apply = (function(exports){
    let img
    function init(){
        img = new ClipMaskImg({
            maskElem: '.m_apply-mask',
            imgElem: '.apply-img',
            clipPosition: 'center',
            maskTime: 1, maskEase: BezierEasing(0.8,0,0,1),
            imgTime: 1.7, imgEase: BezierEasing(0.4,0,0.2,1),

            wordElem: '.m_section-apply .m_apply-txt',
            charGap: 450,
            wordTime: 1.5, wordEase: BezierEasing(0.6,0,0.1,1),
        });
        img._set();
        ST();
        gsap.set('.m_apply',{ y: 120 })
    };

    function ST(){
        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_section-apply',
            start: `top 85%`, 
            onEnter:()=>{
                img.play();                
                gsap.to('.m_apply', 1.5, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
            }
        });
    };

    exports.init = init
    return exports;
})({})

/* ====================================================================================================================*/
/* 섹션 : 런치 유어 브랜드  */
const Secction_LYB = (function(exports){
    let launchImg
    let yourImg
    let brandImg

    function init(){
        let maskT = 1
        let maskC = BezierEasing(0.6,0,0.1,1)
        let imgT = 1.2
        let imgC = BezierEasing(0.4,0,0.2,1)
        let wordT = 1.5
        let wordC = BezierEasing(0.8,0,0,1)

        launchImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-1",
            imgElem: ".m_lyb.is-1 .m_ybd_launch-img",
            clipPosition: 'left',
            wordElem: '.m_lyb.is-1 .m_apply-txt',

            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 300,
            wordTime: wordT, wordC,
        })
        yourImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-2",
            imgElem: ".m_lyb.is-2 .m_ybd_launch-img",
            clipPosition: 'left',
            wordElem: '.m_lyb.is-2 .m_apply-txt',

            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 300,
            wordTime: wordT, wordC,
        })
        brandImg = new ClipMaskImg({
            maskElem: ".m_lyb.is-3",
            imgElem: ".m_lyb.is-3 .m_ybd_launch-img",
            clipPosition: 'left',
            wordElem: '.m_lyb.is-3 .m_apply-txt',

            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 300,
            wordTime: wordT, wordC,
        })
        reset()
        ST()
    };

    function ST(){
        let opts = {
            // markers: true, 
            scroller: scrollTriggerScroller,
            start: `top 95%`
        }

        ScrollTrigger.create({
            trigger: '.m_lyb.is-1',
            onEnter:()=> launchImg.play(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-2',
            onEnter:()=> yourImg.play(),
            ...opts
        })
        ScrollTrigger.create({
            trigger: '.m_lyb.is-3',
            onEnter:()=> brandImg.play(),
            ...opts
        })
    };

    function reset(){
        launchImg._set();
        yourImg._set();
        brandImg._set();
    }

    exports.init = init 
    
    return exports;
})({});

/* ====================================================================================================================*/
/* 섹션 : 스텝  */
const Section_Step = (function(exports){
    const stepArr = document.querySelectorAll('.m_step_block_color');

    function init(){

        stepArr.forEach((item, i)=>{
            gsap.set( item, {clipPath: `circle(0% at 50% 50%)`})
        })
        let staggerT = 0.15

        stepArr.forEach((item, i)=>{
            ScrollTrigger.create({
                // markers: true,
                scroller: scrollTriggerScroller,
                trigger: stepArr[i],
                start: `top 75%`, 
                onEnter:()=>{
                    gsap.to( stepArr[i], 0.5, {clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.4,0,0.1,1)})
                }
            })
        });
    }

    exports.init = init;
    return exports
})({})

/* ====================================================================================================================*/
// /* Next Fashion */
const Section_Next = (function(exports){
    let textMotion

    function init(){
        // gsap.set(".m_next-fashion", {y: '-40%' })
        // const ani = gsap.to(".m_next-fashion", 1, {y: '30%' })
        const ani = gsap.fromTo(".togerther-img", 1, {
            y: '-50%' ,
        }, {
            y: '50%', 
            ease: 'none'
        })
        
        ScrollTrigger.create({
            // markers: true, 
            scroller: scrollTriggerScroller,
            trigger: '.m_section-next-fashion',
            animation: ani,
            scrub: true
        })

        // textMotion = new LetterSpacing({
        //     wordElem: '.m_next-fashtion-txt', 
        //     wordScale: 2, 
        //     charScale: 1,
        //     time: 1,
        //     easing: BezierEasing(0.6,0,0,1),
        // })   
        // textMotion._set()

        // ScrollTrigger.create({
        //     markers: true,
        //     scroller: scrollTriggerScroller,
        //     id: 'textMotion', 
        //     start: "top 60%",
        //     trigger: '.m_section-next-fashion',
        //     onEnter:()=> textMotion.play(),
        // }) 
    }
    exports.init = init;
    return exports;
})({})

/* ====================================================================================================================*/
// /* 선발 리스트 */
const Section_List = (function(exports){
    const listMaskArr = document.querySelectorAll('.winner-mask');
    const listLinkArr = document.querySelectorAll('.winner-link');
    
    const rowTotalNum = Math.ceil(document.querySelectorAll('.cms-winner_item').length / 2);

    function init(){
        listLinkArr.forEach((item, i)=>{ gsap.set( item, { autoAlpha: 0 }) })
        ST();
    }

    function ST(){
        for(let i=0; i<rowTotalNum; i++){
            ScrollTrigger.create({
                // markers: true, 
                scroller: scrollTriggerScroller,
                trigger: listMaskArr[i*rowTotalNum],
                start: `center 95%`,
                onEnter:()=>{
                    tl(i*rowTotalNum)
                    if(listMaskArr[i*rowTotalNum + 1]) setTimeout(()=>{ tl(i*rowTotalNum + 1) }, 100)
                },
                onLeaveBack: self => self.disable()
            })
        }
    }

    function tl(num){
        gsap.set( listLinkArr[num].querySelector('.winner-img'), { scale: 1.5})

        let _tl = gsap.timeline();
        _tl.to( listMaskArr[num], 0.5, {ease: "Quint.easeOut", width: '100%',
            onComplete:()=>{
                gsap.set( listLinkArr[num], { autoAlpha: 1 })
            }
        })
        _tl.to( listMaskArr[num], 0.5, {ease: BezierEasing(0.7,0,0,1), scaleX: 0, transformOrigin:'right'} )
        _tl.to( listLinkArr[num].querySelector('.winner-img'), 0.5, {
            ease: BezierEasing(0.6,0,0.1,1), scale: 1,
            onComplete:()=>{ 
                gsap.set(listMaskArr, {width: '0%', scale: 1})
            }
        }, '=-0.5')
    }

    exports.init = init
    return exports;

})({})

/* ====================================================================================================================*/
// /* FAQ - Swiper */
const FAQ = new Swiper(".m_faq-wrap", {slidesPerView: "auto",});

/* ====================================================================================================================*/
// /* 문의하기 */
const Section_Contact = (function(exports){
    let plane;
    let interval = null;
    function init(){
        plane = lottie.loadAnimation({
            container: document.querySelector('.m_section-contact .m_inner'),
            loop: false, autoplay: false, renderer: 'svg', 
            animationData: path_m_plane 
        });
        
        plane.onComplete = function(){
            gsap.to( '.m_inner', .55, { 
                delay: .6, height: 0, y:-460,
                backgroundColor:'#BDFF00',
                ease: BezierEasing(0.5,0,0,1),
                onComplete:()=>{
                    plane.goToAndStop(1, false)
                    gsap.set('.m_inner', { opacity: 0 } )
                    clearInterval(interval)
                    interval = null
                } 
            });
        };

        gsap.set(['.msg_success', '.msg_success > *'], {height: 0, fontSize: 0, padding: 0} )
        $('#email-form').submit(function(e){
            fromSubmitPlay()
        });
        // $('.m_contact_submit').click(function(){ // 테스트 용
        //     fromSubmitPlay()
        // })
    };

    function fromSubmitPlay(){
        $('#email-form').css('display', "none");
        $('.m_contact_submit_finish').css("pointer-events" , "auto")

        const tl = gsap.timeline({})
        tl.set('.m_inner', { autoAlpha: 1, height: 50, y:0, backgroundColor:'#BDFF00'} )
        tl.to('.m_inner', 0.5, { 
            backgroundColor:'#333',
            height: 460, 
            ease: BezierEasing(0.6,0,0.1,1),
            onComplete:()=>{
                fromReset()
            }
        })
        plane.play()
    }

    function fromReset(){
        $('#email-form').css('display', "block");
        interval = setInterval(() => {
            $('#email-form').css('display', "block");
            console.log('interval')
        }, 60/1000);
        $('.m_contact_submit_finish').css("pointer-events" , "none");

        $('#email-form input[type=email]').val('');
        $('#email-form input[type=text]').val('');
        $('#email-form #Content-2').val('');
    }

    exports.init = init;
    return exports
})({})