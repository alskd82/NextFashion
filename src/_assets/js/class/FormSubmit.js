import { gsap } from "gsap";

import lottie from 'lottie-web'
import path_plane from "../path/plane.json"

const FormSubmit = function(){
    let formSize, submitSize, isPlay = false;
    let intervalId;
    gsap.set('.contact_submit_finish .inner', {opacity: 0} )
    gsap.set(['.msg_success', '.msg_success > *'], {height: 0, fontSize: 0, padding: 0} )

    const plane = lottie.loadAnimation({
        container: document.querySelector('.contact_submit_finish .inner'),
        renderer: 'svg', loop: false, autoplay: false,
        // path: 'https://static.msscdn.net/webflow/static/partners/plane.json'
        animationData: path_plane
    });    

    function submitFinishResize(){
        let _y;
        let _height;
        if(isPlay ){
            _y = 0;
            _height = formSize.h;
        } else {
            _y = formSize.h-submitSize.h;
            _height = submitSize.h;
        }

        gsap.set('.contact_submit_finish', {width: formSize.w, height: formSize.h } )
        gsap.set('.contact_submit_finish .inner', {width: submitSize.w, height:_height, y: _y} )
        
    }
    function formResize(){
        formSize = {
            w: gsap.getProperty('#formContact', 'width'),
            h: gsap.getProperty('#formContact', 'height'),
        }
        submitSize = {
            w: gsap.getProperty('#formContact .contact_submit', 'width'),
            h: gsap.getProperty('#formContact .contact_submit', 'height'),
        }
        submitFinishResize()
    }
    formResize();
    window.addEventListener('resize', ()=> formResize() );

    function fromReset(){
        console.log('formReset')
        $('#email-form').css('display', "block");
        clearInterval(intervalId)
        intervalId = null;
        emailFormDisplay('block')

        $('.contact_submit_finish').css({
            position: 'absolute',
            marginLeft: '10px',
            marginBottom: '15px'
        })

        $('#email-form input[type=email]').val('');
        $('#email-form input[type=text]').val('');
        $('#email-form #Content').val('');
    }

    function emailFormDisplay( display ){
        intervalId = setInterval(()=>{
            if( $('#email-form').css('display') != display) {
                $('#email-form').css('display', display);
            }
            console.log("intevalId")
        },60/1000)
    }
    
    function fromSubmitPlay(){
        submitFinishResize()
        $('#email-form').css('display', "none");
        clearInterval(intervalId)
        intervalId = null;
        emailFormDisplay('none');
        $('.contact_submit_finish').css({ position: 'relative', margin: '0' })

        isPlay = true;
    
        const tl = gsap.timeline({})
        tl.set('.contact_submit_finish .inner', { opacity: 1, backgroundColor:'#BDFF00'} )
        tl.to('.contact_submit_finish .inner', 0.5, { 
            backgroundColor:'#333',
            height: formSize.h , 
            y:0, 
            ease: BezierEasing(0.6,0,0.1,1),
            onComplete:()=>{
                fromReset()
            }
        })
        // tl.to( '.contact_submit_finish .inner', .55, { 
        //     delay: 1, 
        //     height: 0, 
        //     backgroundColor:'#BDFF00',
        //     ease: BezierEasing(0.5,0,0,1)
        // })

        setTimeout(()=>{
            plane.play();
        }, 100)
    };
    plane.onComplete = function(){
        // console.log( plane.currentFrame )
        // if(plane.currentFrame > 140 && isPlay){
            isPlay = false;
            gsap.to( '.contact_submit_finish .inner', .55, { 
                delay: .6,
                height: 0,
                backgroundColor:'#BDFF00',
                ease: BezierEasing(0.5,0,0,1),
                onComplete:()=>{
                    plane.goToAndStop(1, false)
                    gsap.set('.contact_submit_finish .inner', { opacity: 0 } )
                    clearInterval(intervalId)
                    intervalId = null;
                } 
            });
        // }
        
    };
    
    $('#email-form').submit(function(e){
        fromSubmitPlay()
    });
//     $("input[type=submit]").on('click', ()=>{
//         fromSubmitPlay()        
//     });
}

export default FormSubmit