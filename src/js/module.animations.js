/*
 *  Class Gsap 1
 */
import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin.js";
// import { PixiPlugin } from "gsap/PixiPlugin.js";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

export
    default class Animations {

    constructor() {
        gsap.registerPlugin(CSSPlugin/*, PixiPlugin, MotionPathPlugin*/);
    }

    firstCall(){
        return 'bla';
    }

    runFirstAnimation(){
        //gsap.to("#anim-cont-1", {backgroundColor: "#8f3", duration: 2});
    }

    runSecondAnimation(){
        // gsap.from(  "#anim-cont-1", {x: 500, height:400, top:0, background:"#8f3", duration: 0.1});
        // gsap.from(  "#anim-cont-1", {x:0, height:400, top:0, background:"#8f3", duration: 0.1});
        // gsap.to(    "#anim-cont-1", {x:0, height:300, top:0, background:"#892", duration: 0.5});
        //gsap.from(    ".cube", {rotateY: 30, duration: 0.5});
        // gsap.to(".cube", {rotateY: 90, x: -400, height:200, duration: 0.2});
        
    }

    out(){
        return 'in gsap out';
    }

}