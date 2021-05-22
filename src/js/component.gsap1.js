/*
 *  Class Gsap 1
 */
import { gsap } from "gsap";
// import { PixiPlugin } from "gsap/PixiPlugin.js";
// import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

export
    default class Gsap1 {

    constructor() {
        // gsap.registerPlugin(PixiPlugin, MotionPathPlugin);
    }

    runFirstAnimation(){
        gsap.to("#square", {backgroundColor: "#8f3", duration: 2});
    }

    out(){
        return 'in gsap out';
    }

}