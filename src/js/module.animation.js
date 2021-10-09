/**
 * Class Animations / GSAP 
 * Singleton - https://k94n.com/es6-modules-single-instance-pattern
 */

import Util from "./module.util";
import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin.js";
// singleton import
import {three3d} from './module.three-3d';
// import { PixiPlugin } from "gsap/PixiPlugin.js";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

let menuIconPosition, closeMenu;

class Animation {

    constructor() {
        gsap.registerPlugin(CSSPlugin/*, PixiPlugin, MotionPathPlugin*/);
    }

    preloadSpinning(){

        let tlRepeat = gsap.timeline();
        tlRepeat.to('.preload-item-1', { ease: "power1.out", duration: 1.5, repeat: -1 }, '-=2');
        tlRepeat.to('.preload-item-1', {rotation: 360, borderRadius: '50%',  ease: "power1.out", duration: 1.5, repeat: -1 }, '-=2');
        
        tlRepeat.to('.preload-item-2', { ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.9');
        tlRepeat.to('.preload-item-2', {rotation: 360, borderRadius: '50%',  ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.9');
        
        tlRepeat.to('.preload-item-3', { ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.8');
        tlRepeat.to('.preload-item-3', {rotation: 360, borderRadius: '50%',  ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.8');
        
        tlRepeat.to('.preload-item-4', { ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.7');
        tlRepeat.to('.preload-item-4', {rotation: 360, borderRadius: '50%',  ease: "power1.out", duration: 1.5, repeat: -1 }, '-=1.7');

    }

    preloadStartAnimation(resolve, reject){

        //this.preloadSpinning();

        let tl = gsap.timeline({onComplete: () => {console.log('DONE 1'); return resolve();}});
        tl.to('.preload-container', {opacity:1, ease: "expo.in", duration: 2});
        tl.to('.preload-container', {opacity:0, ease: "expo.out", duration: 0.5}, '+=4');
 
    }

    preloadStartTransitionAnimation(resolve, reject){

        let tl = gsap.timeline({onComplete: () => {
            console.log('DONE 2'); 
            let nav = document.querySelector('nav.view-wrapper');
            nav.style.opacity = 1;
            return resolve();
        }});
        tl.to('.view-wrapper.preload', {height:0, ease: "power2.in", duration: 1});

        tl.from('.claim-item', {y: -50, opacity:0, stagger: .1, ease: "power3.out", duration: 1}, '+=0');
        tl.to('.claim-item', { ease: "expo.out", duration: 1});

        tl.to('.logo', {opacity:1, ease: "expo.out", duration: 2}, '-=2');
        tl.to('button.burger-nav-btn', {opacity:1, ease: "expo.out", duration: 2}, '-=1.5');
        tl.to('.perspective-bottom', {bottom:'5%', right:'9%', ease: "expo.out", duration: 1}, '-=3');
        
        three3d.init(); 
    }

    startPageClaimAnimation(event){

        let claimItem1 = document.querySelector('.claim-item-1 h2');
        let claimItem2 = document.querySelector('.claim-item-2 h2');
        let claimItem3 = document.querySelector('.claim-item-3 h2');
        let x = event.touches ? event.touches[0].clientX : event.clientX;
        let w = window.innerWidth / 2;

        let l1 = -(x - w) / (w / 2) + 18;
        let l2 = -(x - w) / (w / 3) + 20;
        let l3 = -(x - w) / (w / 4) - 1;

        //console.log(l2)

        // position / rotation
        gsap.to(claimItem1, {duration:0.5, position:"absolute", left: l1 + '%'});
        gsap.to(claimItem2, {duration:0.5, position:"absolute", right: l2 + '%'});
        gsap.to(claimItem3, {duration:0.5, position:"absolute", left: l3 + '%'});
    }

    preloadDisplayAnimation(){

        gsap.to('.preload-container', {opacity:1, ease: "expo.in", duration: 0.5});

    }

    preloadHideAnimation(previousArticleId, currentArticle){

        let preloadWrapper = document.querySelector('.view-wrapper.preload');
        let progressParent = document.querySelector('#article-'+previousArticleId);
        progressParent.style.overflow = "hidden";

        let tl = gsap.timeline({onComplete: (event) => {
            // hide preloader
            preloadWrapper.style.display = 'none';
            // Set current article on top of the zIndex stack
            currentArticle.setZIndex(currentArticle.getZIndex()+2);
            // parent reset to initial height, overflow after animation
            progressParent.style.height = "100vh";
            progressParent.style.overflow = "visible";
        }});
        tl.to('.preload-container', {opacity:0, ease: "expo.in", duration: 0.5});
        tl.to('#article-'+previousArticleId, {duration: 0.5, height: 0, ease: "expo.out"});

    }

    swipeOutNavMenu(toggle){

        let tl = gsap.timeline({onComplete: (event) => {
            let navElList = document.querySelectorAll('.nav-animation');
            for (let i in navElList) {
                if(navElList.hasOwnProperty(i)){
                    navElList[i].style.display = "none";
                    navElList[i].style.transition = "opacity 0.5s linear 0s";
                    navElList[i].style.opacity = 0;
                }
            }
            this.toggleNavMenu(toggle)
        }});

        tl.to('nav.view-wrapper', {duration: 0.5, height: 0, ease: "expo.out"});

    }

    toggleNavMenu(toggle){

        if(toggle){
            gsap.to('.burger-nav-btn div', {top: 0, ease: "expo.in"});
            gsap.to('.burger-nav-btn .menu', {opacity: 0, duration:.8});
            gsap.to('.burger-nav-btn .close', {opacity: 1, duration:.8,});
        }else{
            gsap.to('.burger-nav-btn div', {top: menuIconPosition, ease: "expo.out"});
            gsap.to('.burger-nav-btn .close', {opacity: 0, duration:.8});
            gsap.to('.burger-nav-btn .menu', {opacity: 1, duration:.8,});
        }

    }

    buttonEventNavMenu(event, toggle){

        let maxSize = Util.getViewPortMaxAxis();
        let size = maxSize*2.5 + 'px';
        let offset = -maxSize + 'px';
        document.body.style.overflow = 'hidden';

        let navElList = document.querySelectorAll('.nav-animation');

        if(toggle){

            closeMenu = document.querySelector('.burger-nav-btn .material-icons');
            menuIconPosition = window.getComputedStyle(closeMenu).top;

            let tlOn = gsap.timeline({onComplete: () => {
                document.querySelector('nav.view-wrapper').style.height = '100vh';
                document.querySelector('nav.view-wrapper').style.width = '100vw';
                document.querySelector('nav.view-wrapper').style.top = '0px';
                document.querySelector('nav.view-wrapper').style.right = '0px';
                document.querySelector('nav.view-wrapper').style.borderRadius = '0px';
                document.body.style.overflow = 'auto';

                for (let i in navElList) {
                    if(navElList.hasOwnProperty(i)){
                        navElList[i].style.display = "inline-block";
                        navElList[i].style.transition = "opacity 0.5s linear 0s";
                        navElList[i].style.opacity = 0;
                    }
                }
                
                gsap.from('.nav-animation', {y: -100, stagger: .1});
                gsap.to('.nav-animation', {duration: 0.3, opacity: 1}, '-=1');
            }});

            tlOn.to('nav.view-wrapper', {top: offset, right: offset, width: size, height: size, ease: "power2.in", duration: .8}, '-=0');
            this.toggleNavMenu(toggle);

        }else{

            document.querySelector('nav.view-wrapper').style.height = size;
            document.querySelector('nav.view-wrapper').style.width = size;
            document.querySelector('nav.view-wrapper').style.top = offset;
            document.querySelector('nav.view-wrapper').style.right = offset;
            document.querySelector('nav.view-wrapper').style.borderRadius = '50%';

            for (let i in navElList) {
                if(navElList.hasOwnProperty(i)){
                    navElList[i].style.display = "none";
                    navElList[i].style.transition = "opacity 0.5s linear 0s";
                    navElList[i].style.opacity = 0;
                }
            }

            let tlOff = gsap.timeline({onComplete: () => {
                document.body.style.overflow = 'auto';
            }});

            // TODO check css rules of gsap, maybe class content can be sued here rather then fixed values
            tlOff.to('nav.view-wrapper', {top: '60px', right: '60px', width: '60px', height: '60px', ease: "power2.out", duration: .8});
            this.toggleNavMenu(toggle);
        }
        
        
    }

    transitionChaining(){

        return {
            run: (callback, obj) => {
                let p  = new Promise(
                    (resolve, reject) => {
                        return callback(resolve, reject, obj);
                    }
                );
                return p;
            }
        }

    }

}

export let animation = new Animation();
