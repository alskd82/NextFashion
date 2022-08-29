import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

import lottie from 'lottie-web'
import path_textMastking from "./path/section-desc_text.json"

import BezierEasing from './class/BezierEasing.esm';

import {ClipMaskImg} from "./class/ClipMaskImg"
import {LetterSpacing} from "./class/LetterSpacing"

import FormSubmit from "./class/FormSubmit";

import ShowDetail from "./class/ShowDetail";

import Loading from "./class/Loading";


const gnbWrap = document.querySelector('.gnb-wrap');
const floatingDownload = document.querySelector('.float-download');


let detailContent; // 상세 
let loader; // 상세 불러올 때 로딩 띄우기 위해
let isGnbOpenForce = false; // gnb 강제 오픈 //
let prevPageY;
let scrollDirection;

document.addEventListener("DOMContentLoaded", e=>{

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
    GNB.init()

    Billboard.init();
    // Billboard.play();
    Billboard.ST();

    SectionDesc.init();
    SectionApply.init();
    Section_TargetHow.init();
    Section_LYB.init();
    Section_Step.init();
    Section_Next.init();

    Section_List();
    Section_Supporters();

    FormSubmit()


    addEvent()
    /* 이메일 바로가기 */
    document.querySelector('.txt_email-underline').addEventListener('click', ()=> goToEmail() )
    document.querySelector('.map_txt-item_t3').addEventListener('click', ()=> goToEmail() )
    const goToEmail =()=> window.open('about:blank').location.href = 'mailto:nextfashion@musinsapartners.com';

    /* 지원서 다운로드 링크 */
    floatingDownload.addEventListener('click', downloadLink, false );
    document.querySelector('.btn_download').addEventListener('click', downloadLink, false )
    function downloadLink(e) {
        e.preventDefault()
        window.open('about:blank').location.href = document.querySelector('#DonwloadURL').getAttribute('href'); 
    }

    // /*  상세 */
    detailContent = new ShowDetail();
    detailContent.init()

});


/* ====================================================================================================================*/
/* Event */
function addEvent(){
    floatingDownload.addEventListener('mouseenter', Floating.floatingDownload_Fn, false);
    floatingDownload.addEventListener('mouseleave', Floating.floatingDownload_Fn, false);
    

    window.addEventListener('resize', ()=>{  ScrollTrigger.refresh(); })
    window.addEventListener('scroll', scroll_Fn, false);

    /* 섹션 이동  */
    const targetSections = [
        '.section-apply', 
        ".section-lyb", 
        '#SectionBenefit',
        "#SectionWinner",
        "#SectionFAQ",
        "#SectionContact",
        "#SectionSupporters"
    ]
    document.querySelectorAll('.navi_item').forEach((navi, i)=>{
        navi.addEventListener('click', (e)=>{
            e.preventDefault();
            // const target = e.currentTarget.getAttribute('href')
            isGnbOpenForce = true;
            if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )

            let _offset = 100;
            if(i === 3 || i === 6) {
                _offset = 0;
            }
            else if( i === 2) {
                _offset = -80;
            }
            gsap.killTweensOf(window) 
            gsap.to(window, 1.2, { 
                scrollTo:{ y: targetSections[i] , offsetY: _offset}, 
                ease: "Quart.easeInOut",
                onComplete:()=> { gsap.delayedCall(0.2, isGnbOpenForceReset) }
            });

            function isGnbOpenForceReset(){
                if(gsap.isTweening(window)) return;
                isGnbOpenForce = false
            }
        })
    })

    /* 로고 이동 */
    document.querySelector('.logo-wrap').addEventListener('click', e =>{
        // window.open('about:blank').location.href = "https://www.musinsapartners.co.kr/";
        // window.location.reload();
        document.querySelector('#LoadWrap').style.display = 'block';
        Loading.overlay_play();
        // isRefresh = true;
    })

    /* 상세 불러오기 */
    document.querySelectorAll('.winner-link').forEach((winner, i)=>{
        winner.addEventListener('click',e=>{
            e.preventDefault();
            const URL = e.currentTarget.getAttribute('href');
            console.log( URL )

            detailContent.bodyBlock(true, window.pageYOffset);
            detailContent.fetchPage( URL );
        });
    });
}


/* ====================================================================================================================*/
/* Floating */
const Floating = (function(exports){
    /* 참가 신청서 색상 바꾸기 */
    function floatingColor_Fn(isChange){ 
        const _b = floatingDownload.classList.contains('mode-fill');
        if(isChange && !_b) floatingDownload.classList.add('mode-fill')
        else if(!isChange && _b) floatingDownload.classList.remove('mode-fill')
    }

    /* 다운로드 버튼 색상 변화 시점 */
    const ioFloatingOptions = { rootMargin: '0px 0px -85px 0px' }
    const ioFloating = new IntersectionObserver(( entries, observer )=>{
        if(entries[0].isIntersecting){
            floatingDownload.setAttribute('data-mode', 'fill')
            // floatingDownload.classList.add('mode-fill')
            gsap.set('.float-download .ic-download_arrow, .ic-download_floor' , {stroke: 'black'})
            gsap.set('.float-download span' , {color: 'black'})
            gsap.set('.float-download .ic-download' , {backgroundColor: '#BDFF00'})
        } else {
            floatingDownload.setAttribute('data-mode', 'stroke')
            // floatingDownload.classList.remove('mode-fill')
            gsap.set('.float-download .ic-download_arrow, .float-download .ic-download_floor' , {stroke: '#BDFF00'})
            gsap.set('.float-download span' , {color: '#BDFF00'})
            gsap.set('.float-download .ic-download' , {backgroundColor: 'rgba(0,0,0,0)'})
        }
    }, ioFloatingOptions)
    // ioFloating.observe( document.querySelector('.section-supporters') );

    /* 다운로드 버튼 마우스 반응 */
    function floatingDownload_Fn(e){
        // if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
        const _arrow = document.querySelector('.float-download .ic-download_arrow');
        const _floor = document.querySelector('.float-download .ic-download_floor');
        if(e.type === 'mouseenter'){
            let tl = gsap.timeline()
            tl.to( _arrow, 0.25, {ease: BezierEasing(0.33, 0, 0.67, 1.0), y: 25, onComplete:()=> gsap.set( _arrow,{ y: -25 }) } )
            tl.to( _floor, 0.2, {ease: BezierEasing(0.33, 0, 0.67, 1.0), transformOrigin:"center", scaleX: 0}, "=-0.25")
            tl.to( _floor, 0.25, {ease: "Quint.easeOut", scaleX: 1 }, "=+0.1")
            tl.to( _arrow, 0.3, {ease: "Quint.easeOut", y: 0 }, "=-0.2");

            if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
            gsap.to( [_arrow,_floor] , 0.2, {stroke: 'black'})
            gsap.to('.float-download span' , 0.2, {color: 'black'})
            gsap.to('.float-download .ic-download' , 0.2, {backgroundColor: '#BDFF00'})
        }
        else if(e.type === 'mouseleave'){
            if(floatingDownload.getAttribute('data-mode') != 'stroke') return;
            gsap.to( [_arrow,_floor] , 0.2, {stroke: '#BDFF00'})
            gsap.to('.float-download span' , 0.2, {color: '#BDFF00'})
            gsap.to('.float-download .ic-download' , 0.2, {backgroundColor: 'rgba(0,0,0,0)'})
        }
    }

    function init(){
        ioFloating.observe( document.querySelector('.section-supporters') );

        floatingDownload.addEventListener('mouseenter', floatingDownload_Fn, false);
        floatingDownload.addEventListener('mouseleave', floatingDownload_Fn, false);
    }

    exports = { init, floatingDownload_Fn, floatingColor_Fn }
    return exports;
})({});


/* ====================================================================================================================*/
/* GNB */
const GNB = (function(exports){
    /* gnb 등장-숨기기 */
    function gnbShowHide_Fn( state ){       
        if( document.querySelector('.winner_page') ) return;
        if( document.body.style.position === 'fixed' ) return
        const _y = (state === 'show') ? 0 : -gsap.getProperty('.gnb-wrap', 'height');
        document.querySelector('.gnb-wrap').setAttribute('data-state', state)
        gsap.to('.gnb-wrap .navi', .6, {ease: "Quint.easeOut", y: _y})
    }

    /* gnb 색상 바꾸기 */
    function gnbChangeColor_Fn(isChange){                   
        const _b = gnbWrap.classList.contains('black') 
        if(isChange && !_b) gnbWrap.classList.add('black')
        else if(!isChange && _b) gnbWrap.classList.remove('black')
    }

    /* gnb 색상 변화 시점 */
    const ioGnbOptions = { rootMargin: '0px 0px -95% 0px' }
    const ioGnb = new IntersectionObserver(( entries, observer )=>{
        entries[0].isIntersecting ? gnbChangeColor_Fn(true) : gnbChangeColor_Fn(false)
    }, ioGnbOptions)
    // ioGnb.observe( document.querySelector('.section-supporters') )

    /* 풋터 등장 시점 - gnb 강제 호출을 위해 */
    const ioFooterOptions = { rootMargin: '0px 0px -160px 0px' }
    const ioFooter = new IntersectionObserver(( entries, observer )=>{
        isGnbOpenForce = entries[0].isIntersecting
    }, ioFooterOptions);
    // ioFooter.observe( document.querySelector('footer') )

    function init(){
        ioGnb.observe( document.querySelector('.section-supporters') )
        ioFooter.observe( document.querySelector('footer') )
    }

    exports = {init, gnbShowHide_Fn, gnbChangeColor_Fn};

    return exports
})({})

/* ====================================================================================================================*/
/* SCROLL */

function scroll_Fn(e){
    // if( window.pageYOffset <= window.innerHeight) billboard.dim(window.pageYOffset)
    // else {
    //     // billboard.stop();
    //     gsap.to('.billboard', .1, {opacity: 0})
    // }

    if(prevPageY > window.pageYOffset )      scrollDirection = 'up'
    else if(prevPageY < window.pageYOffset ) scrollDirection = 'down'
    prevPageY = window.pageYOffset;

    if(!isGnbOpenForce){
        if( window.pageYOffset > 500 &&  scrollDirection == 'down'){
            if( gnbWrap.getAttribute('data-state') === "show") GNB.gnbShowHide_Fn( 'hide' )
        } else {
            if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )
        }
    } else {
        if( gnbWrap.getAttribute('data-state') === "hide") GNB.gnbShowHide_Fn( 'show' )
    }
}




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
            trigger: '.section-header .billboard',
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
/* Section_Desc - ScrollTrigger */
const SectionDesc = (function(exports){
    //--------------------------------------------------------------------------------------
    /* lottie play */
    document.querySelector('.desc_info-txt').innerHTML += `<div id="textMasking"></div>`;
    const textMasking = lottie.loadAnimation({
        container: document.querySelector('#textMasking'),
        animationData: path_textMastking,
        autoplay: false, loop: false
    })
    //------------------------------------------------------------------------------------------

    function init(){
        let descImg = new ClipMaskImg({
            maskElem: '.desc_img-mask',
            imgElem: '.desc_img',
            clipPosition: 'left',
            imgDelayTime: 0,
        });

        descImg._set()
        
        gsap.set( ".section-desc .desc_txt div", { yPercent: 100})
        gsap.set( ".section-desc .desc_info-txt_p", { yPercent: 100, opacity: 0 })
        ScrollTrigger.create({
            // markers: true,
            trigger: '.desc_img-wrap',
            start: 'top 85%',
            onEnter: ()=> {
                descImg.play()
                gsap.to('.section-desc .desc_txt > div', 1, {delay: .7, yPercent: 0, stagger: 0.1, ease: "Quint.easeOut"})
            }
        })
        

        const showTxt_tl = gsap.timeline({paused: true})
        showTxt_tl.to('.section-desc .desc_info-txt_p', 1.0, { yPercent: 0, stagger: 0.1, ease: "Quint.easeOut"})
        showTxt_tl.to('.section-desc .desc_info-txt_p', .5, { autoAlpha: 1, stagger: 0.1 , ease: "none"}, 0)

        document.querySelector(".desc_info-txt_strong").style.color = 'white'
        ScrollTrigger.create({
            // markers: true,
            trigger: '.desc_info-wrap',
            start: 'top 85%',
            onEnter: ()=> {
                showTxt_tl.play() 
                setTimeout(()=>{ 
                    textMasking.play();
                    setTimeout(()=>{
                        document.querySelector('.section-desc .desc_info-txt_strong').style.color = "#BDFF00"; 
                    },500)
                }, 750)
            }
        })
    };

    exports.init = init;
    return exports;
})({})

/* ====================================================================================================================*/
// /* APPLAY - ScrollTrigger */
const SectionApply = (function(exports){

    function init(){

        let applyClipMaskImg = new ClipMaskImg({
            maskElem: '.apply-mask',
            imgElem: '.apply-img',
            clipPosition: 'center',
            maskTime: 1, maskEase: BezierEasing(0.8,0,0,1),
            imgTime: 1.7, imgEase: BezierEasing(0.4,0,0.2,1),

            wordElem: '.section-apply .apply-txt',
            charGap: 450,
            wordTime: 1.5, wordEase: BezierEasing(0.6,0,0.1,1),
        });
        applyClipMaskImg._set()

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-apply',
            start: `top 75%`, 
            onEnter:()=>{
                applyClipMaskImg.play();                
                gsap.to('.apply-wrap', 1.5, { y: 0, ease: BezierEasing(0.4,0,0.2,1)})
            }
        });

    }

    exports.init = init;
    return exports;
})({}) 

/* ====================================================================================================================*/
// /* 모집대상 - 지원 방법 - 선발 절차 - 선발 혜택*/
const Section_TargetHow = (function(exports){

    function init(){
        document.querySelector("#SectionTarget")
        gsap.set(["#SectionTarget .info-txt_wrap", "#SectionHow .info-txt_wrap"], { opacity: 0} )

        ScrollTrigger.create({
            // markers: true,
            trigger: "#SectionTarget .info-txt_wrap",
            start: "top 80%",
            onEnter: ()=>  gsap.to("#SectionTarget .info-txt_wrap", 1, { opacity: 1, ease: 'Quad.easeInOut'} )
        })

        ScrollTrigger.create({
            // markers: true,
            trigger: "#SectionHow .info-txt_wrap",
            start: "top 80%",
            onEnter: ()=>  gsap.to("#SectionHow .info-txt_wrap", 1, { opacity: 1, ease: 'Quad.easeInOut'} )
        })
    }

    exports.init = init;
    return exports;
})({}) 

/* ====================================================================================================================*/
// /* 런치 유어 브랜드 */
const Section_LYB = (function(exports){
    let launchClipMaskimg
    let yourClipMaskimg
    let brandClipMaskimg

    function init(){
        let maskT = 1
        let maskC = BezierEasing(0.6,0,0.1,1)
        let imgT = 1.2
        let imgC = BezierEasing(0.4,0,0.2,1)
        let wordT = 1.5
        let wordC = BezierEasing(0.8,0,0,1)

        launchClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_launch-mask",
            imgElem: ".ybd_your-img",
            clipPosition: 'left',
            wordElem: '.lyb_launch .apply-txt',
            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 450,
            wordTime: wordT, wordC,
        })
        yourClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_your",
            imgElem: ".ybd_brand-img",
            clipPosition: 'left',
            wordElem: '.lyb_your .apply-txt',
            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 450,
            wordTime: wordT, wordC,
        })
        brandClipMaskimg = new ClipMaskImg({
            maskElem: ".lyb_brand",
            imgElem: ".lyb_brand-img",
            clipPosition: 'left',
            wordElem: '.lyb_brand .apply-txt',
            maskTime: maskT, maskC,
            imgTime: imgT, imgEase: imgC,
            charGap: 450,
            wordTime: wordT, wordC,
        })
        reset()

        function play(){
            launchClipMaskimg.play()
            setTimeout(()=>{ yourClipMaskimg.play() }, 200)
            setTimeout(()=>{ brandClipMaskimg.play() }, 300)
        }

        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-lyb',
            start: `top 85%`, 
            onEnter:()=>{
                play()
            }
        })
    }

    function reset(){
        launchClipMaskimg._set();
        yourClipMaskimg._set();
        brandClipMaskimg._set();
    }

    exports.init = init;

    return exports;
})({})

/* ====================================================================================================================*/
// /* 스텝 */
const Section_Step = (function(exports){
    // const stepArr = document.querySelectorAll('.section-step .step_wrap:nth-of-type(1) .step_block_color');
    const stepArr = document.querySelectorAll('#step .step_block_color');
    const stepTxtArr = document.querySelectorAll('#stepTxt .step_block_color');

    function init(){

        gsap.set( '#SectionStep .info-txt_wrap', {opacity: 0})
        ScrollTrigger.create({
            // markers: true, 
            trigger: '#SectionStep .info-txt_wrap',
            start: `top 85%`,
            onEnter:()=> gsap.to( '#SectionStep .info-txt_wrap', 1, {opacity: 1, ease: 'Quad.easeInOut'})
        });


        stepArr.forEach((item, i)=>{
            gsap.set( item, {clipPath: `circle(0% at 50% 50%)`})
            gsap.set( stepTxtArr[i], {clipPath: `circle(0% at 50% 50%)`})
        })
        let staggerT = 0.15

        ScrollTrigger.create({
            // markers: true, 
            trigger: '#step',
            start: `top 85%`, 
            onEnter:()=>{
                gsap.to( stepArr, 0.75, {stagger: staggerT, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepArr, 1, {stagger: staggerT, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepTxtArr, 0.75, {stagger: staggerT, clipPath: `circle(50% at 50% 50%)`, ease: BezierEasing(0.6,0,0.1,1)})
                gsap.to( stepTxtArr, 1, {stagger: staggerT, y: 0, ease: BezierEasing(0.6,0,0.1,1)})
            }
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

        const ani = gsap.fromTo(".togerther-img", 1, {
            y: '-50%' ,
        }, {
            y: '50%', 
            ease: 'none'
        })
        
        ScrollTrigger.create({
            // markers: true, 
            trigger: '.section-next-fashion',
            animation: ani,
            scrub: true
        })

        textMotion = new LetterSpacing({
            wordElem: '.next-fashtion-txt', 
            wordScale: 1.5, 
            charScale: 1
        })   
        textMotion._set()

        ScrollTrigger.create({
            // markers: true,
            id: 'textMotion', 
            start: "top 30%",
            trigger: '.section-next-fashion',
            onEnter:()=> textMotion.play()
        }) 

    }

    exports.init = init;
    return exports;
})({})

/* ====================================================================================================================*/
// /* 선발 리스트 */
const Section_List = function(){
    let listMaskArr = document.querySelectorAll('.winner-mask');
    let listLinkArr = document.querySelectorAll('.winner-link');
    listLinkArr.forEach((item, i)=>{ gsap.set( item, { autoAlpha: 0 }) })

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
                // gsap.set( listLinkArr, { autoAlpha: 0 })
            }
        }, '=-0.5')
    }

    let rowTotalNum = Math.ceil(document.querySelectorAll('.cms-winner_item').length / 3);

    for(let i=0; i<rowTotalNum; i++){
        ScrollTrigger.create({
            // markers: true, 
            trigger: listMaskArr[i*rowTotalNum],
            start: `center 95%`,
            onEnter:()=>{
                tl(i*rowTotalNum)
                if(listMaskArr[i*rowTotalNum + 1]) setTimeout(()=>{ tl(i*rowTotalNum + 1) }, 100)
                if(listMaskArr[i*rowTotalNum + 2]) setTimeout(()=>{ tl(i*rowTotalNum + 2) }, 200)
            },
            onLeaveBack: self => self.disable(),
        })
    }
}

/* ====================================================================================================================*/
// /* 서포터 */
const Section_Supporters = function(){

    ScrollTrigger.create({
        // markers: true,
        id: 'sticky',
        trigger: '.support-txt_wrap',
        start:'top 100',
        end: ()=> `+=${gsap.getProperty('.support-list', 'height')-80-gsap.getProperty('.support-txt_wrap', 'height')} 100 `,
        scrub: true,
        pin: true
    })

}

