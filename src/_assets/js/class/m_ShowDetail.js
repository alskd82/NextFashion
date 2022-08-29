import { gsap } from "gsap";
import BezierEasing from './BezierEasing.esm';

let loader; // 상세 불러올 때 로딩 띄우기 위해

export class ShowDetail {
    constructor( opts ){
        const defaults = {
        }
        this.opts = {...defaults, ...opts};  

        this.detail = document.querySelector('.m_detail');

        this.title = document.querySelector('.m_detail .m_detail-h1')
        this.brandName = document.querySelector('.m_detail .m_detail-brand-name')
        this.ceo = document.querySelector('.m_detail .m_detail-ceo_name')

        this.brandLink = document.querySelector("#Detail_Url_Brand");
        this._29Link = document.querySelector("#Detail_Url_29");
        this.instaLink = document.querySelector("#Detail_Url_Insta");
        this.shopLink = document.querySelector("#Detail_Url_Shop");

        this.mainImg = document.querySelector('#Detail_Img');

        this.intro = document.querySelector('#DetailTxt_Intro');
        this.after = document.querySelector('#Detail_After');

        this.gallery = document.querySelector('.m_detail-gallery_wrap')

        this.contentReset()
    }

    init(){
        loader = document.createElement('div');
        loader.classList.add('loader-wrapper')
        loader.innerHTML = `<div class="loader"></div>`
        document.body.appendChild(loader)
    }

    pageShow(src){
        loader.classList.add('show')
        gsap.set( this.detail, { autoAlpha: 1 })
        this.fetchPage(src)
    }

    contentReset(){
        gsap.set( this.detail, { y: window.innerHeight + 100, autoAlpha: 0 })

        this.loadImgSrc = []
        gsap.to('.m_detail-wrap', 0, { scrollTo: 0  });

        this.title.innerText =  this.brandName.innerText = this.ceo.innerText = ""
        this.intro.innerText = this.after.innerText = ""
        this.brandLink.style.display = this.instaLink.style.display = this.shopLink.style.display = 'block';
        document.querySelectorAll('.m_detail-gallery_img').forEach( (item)=>item.remove() )
        document.querySelector('.m_detail-wrap').style.top = 0;
    }

    fetchPage(src){
        // loader.classList.add('show')
        const response = fetch(src).then((response)=>{
            return response.text()
        }).then((html)=>{
            const parser = new DOMParser();
            const doc = this.doc = parser.parseFromString(html, 'text/html');
            console.log(doc)

            // 상단 이미지 //
            let mainImagUrl = doc.querySelector('.winner_img').style.backgroundImage;
            this.mainImg.style.backgroundImage = mainImagUrl; 

            // 링크 //
            const brandLink = doc.querySelector('#goToBrand') ? doc.querySelector('#goToBrand').getAttribute('href') : undefined;
            const _29Link = doc.querySelector('#goToBrand') ? doc.querySelector('#goTo29').getAttribute('href') : undefined;
            const instaLink = doc.querySelector('#goToInsta') ? doc.querySelector('#goToInsta').getAttribute('href') : undefined;
            const shopLink = doc.querySelector('#goToShop') ? doc.querySelector('#goToShop').getAttribute('href') : undefined;

            if(brandLink != undefined)  this.brandLink.setAttribute('href', brandLink)
            else                        this.brandLink.style.display = 'none'
            if(_29Link != undefined)  this._29Link.setAttribute('href', _29Link)
            else                       this._29Link.style.display = 'none'
            if(instaLink != undefined)  this.instaLink.setAttribute('href', instaLink)
            else                        this.instaLink.style.display = 'none'
            if(shopLink != undefined)  this.shopLink.setAttribute('href', instaLink)
            else                       this.shopLink.style.display = 'none'
            
            // 브랜드명 //
            const title = doc.querySelector('.winner_content > .winner_h1').innerText;
            const brandName = doc.querySelector('.winner_content > .winner_h3').innerText;
            const ceo = doc.querySelector('.winner_ceo > .winner_h3.is-name').innerText;

            this.title.innerText = title;
            this.brandName.innerText = brandName;
            this.ceo.innerText = ceo;

            // 내용 //
            this.intro.innerText = doc.querySelector('#RichIntro').innerText;
            this.after.innerText = doc.querySelector('#RichAfter').innerText;

            // 갤러리 이미지 //
            this.gUrl = []
            doc.querySelectorAll('.winner_g-thumb').forEach((item, i)=>{
                this.gUrl.push( item.style.backgroundImage );
            })
            // this.gallery.style.overflowX = 'scroll'
            this.gUrl.forEach((imgUrl, i)=>{
                this.gallery.innerHTML += `<div class="m_detail-gallery_img"></div>`;
                document.querySelector(`.m_detail-gallery_img:nth-child(${i+1})`).style.backgroundImage = imgUrl;
            });
            this.gallery.innerHTML += `<div class="m_detail-gallery_img" style="width:20px; background: rgba(0,0,0,0)"></div>`;

            this.imageload()
        })
    }

    imageload(){        
        const mainImgLoad = imagesLoaded(this.mainImg, {background: true });
        mainImgLoad.on('always', (intance)=>{
            gsap.to(this.detail, .6, {delay: .1, y: '0%', ease: BezierEasing(0.33,0.45,0,1), onComplete:()=> loader.classList.remove('show') })
        });
    }

    closePage(){
        gsap.to('.m_detail', .4, {y: window.innerHeight + 20, ease: BezierEasing(0.6,0,1,1), onComplete:()=>{
            this.contentReset();
        }})
    }
}