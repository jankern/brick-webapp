/*
 *  Class Three.js
 */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Utils from "./module.utils";

import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin.js";

let utils = new Utils();
let camera, scene, renderer, textureLoader, texture;
let geometry, material, mesh;
let controls, pointLight, ambientLight, lightHelper, gridHelper;
let loopAnimation, moveCamera, meshObjects, intersects;
let onMouseDown, isMouseDown, onMouseMove, isCamMoving, onWindowResizeScene, eventListener;
let x, y, z;

const gltfLoader = new GLTFLoader();
//const gui = new dat.GUI();

export
    default class Three3d {

    constructor() {
        gsap.registerPlugin(CSSPlugin/*, PixiPlugin, MotionPathPlugin*/);
    }

    init(){

        x = -0.01;
        y = -0.01;    
        z = 0.00;
        isCamMoving = false;
        //isMouseDown = false;

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );    
        scene = new THREE.Scene();

        textureLoader = new THREE.TextureLoader();
        //texture = textureLoader.load('../img/Cluster1.jpg');

        // loading model
        let model;

        gltfLoader.load(
            "./assets/gltf/showroom.glb",
            (glb) => {

                model = glb.scene;

                // todo funktion
                model.scale.set(1.8,2.0,2);
                model.rotation.x = 0.0;
                model.rotation.y = -0.8;

                model.position.z = 0.05;
                model.position.y = -0.05;

                model.castShadow = true;
                model.receiveShadow = true;

                // model.traverse ( ( o ) => {
                //     if ( o.isMesh ) {
                //       // note: for a multi-material mesh, `o.material` may be an array,
                //       // in which case you'd need to set `.map` on each value.
                //       o.material.map = texture;
                //     }
                //   } );

                scene.add(model);

                onMouseMove = (ev) => {
                    this.onMouseMove(ev, model);
                }

                onMouseDown = (ev) => {
                    this.onMouseDown(ev, model);
                }

                onWindowResizeScene = (ev) => {
                    this.onWindowResizeScene(ev);
                }

                // TODO funktion
                this.eventListener().mouseMove.add();
                this.eventListener().mouseDown.add();
                this.eventListener().resize.add();

                //document.addEventListener('mousedown', onMouseDown, false);
                //document.addEventListener('mousemove', onMouseMove, false);

                gsap.from(model.scale, {duration: 3, x: 1.6, ease: "expo.out"})
                gsap.to(model.scale, {duration: 3,x: 1.8, ease: "expo.out"})
            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total * 100) + '%');
            }, 
            (err) => {
                console.log(err);
            }
        );

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0.6,1,1);

        scene.add(light);

        /* ------------- HELPER ---------------- */
    
        // moved out -> check git branch for initial animation

        /* ------------------------------------- */
    
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor (0x000000, 0);
        renderer.setSize( window.innerWidth, window.innerHeight ); 

        camera.position.set(-0.06, 0.04, 0.3);

        // loopAnimation = () => {

        //     requestAnimationFrame(loopAnimation);
            
        //     if(isCamMoving && y > -0.12){
        //         this.moveCamera(camera, x, y, z);
        //         x += 0.01;
        //         y -= 0.02;
        //         z -= 0.02;
        //     }

        //     renderer.render( scene, camera );  
        // };

        //loopAnimation();

        this.loopAnimation();

        let parentLayer = document.querySelector('.view-wrapper.start');
        parentLayer.appendChild( renderer.domElement );
        //document.body.appendChild( renderer.domElement );

    }

    // loop abschalten
    // mouse move abschalten
    // mouse down abschalten
    // window resize abschalten

    loopAnimation(){

        requestAnimationFrame(() => {this.loopAnimation()});
        
        if(isCamMoving && y > -0.12){
            this.moveCamera(camera, x, y, z);
            x += 0.01;
            y -= 0.02;
            z -= 0.02;
        }

        renderer.render( scene, camera );  
    }
    
    detectIntersectedModel(event, model) {

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        intersects = raycaster.intersectObjects(scene.children, true);

        for(let i in intersects){
            console.log(intersects[i])
        }

        const intersectedList = intersects.find(
            (intersectedEl) => intersectedEl.object.parent.uuid === model.uuid
        );

        return intersectedList;
    }

    moveCamera(camera, x, y, z){
        let tmpx = -0.05 - x,
        tmpy = 0.06 + y, 
        tmpz = 0.3 + z;

        camera.position.set(tmpx, tmpy, tmpz);
        console.log('camera moved');
        // can be used to set rotation
        camera.lookAt(0, 0, 0);
    }

    onMouseMove(event, model){
        if (isMouseDown) {
            //return;
        }

        event.preventDefault();

        let intersectedList;
        intersectedList = this.detectIntersectedModel(event, model);
        
        let bg = document.querySelector('.perspective-bottom');

        if (intersectedList) {

            bg.classList.add('active');
            bg.classList.remove('inactive');

            // let tl = gsap.timeline();
            // tl.to(intersectedList[i].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut}, "=-1.5")
            gsap.to(model.scale, {duration: 1, x: 2.5, y:3, ease: "expo.out"})

        }else{
            gsap.to(model.scale, {duration: 1, x: 1.8, y:2, ease: "expo.out"});
            bg.classList.add('inactive');
            bg.classList.remove('active');
        }
    }

    onMouseDown(event, model){
        event.preventDefault();
        //isMouseDown = true;

        let intersectedList;
        intersectedList = this.detectIntersectedModel(event, model);

        console.log('in DOWN');
        console.log(intersectedList);

        if(intersectedList){

            
            console.log('Tuwas, biddee, Klappe die Zweite');
            isCamMoving = true;

            let maxSize = utils.getViewPortMaxAxis();
            let size = maxSize*2.5 + 'px';
            let offset = -maxSize + 'px';
            // document.body.style.overflow = 'hidden';

            let tl = gsap.timeline({onComplete: window.startGallery});
            tl.to(model.scale, {duration: 2, x: 5, y:6, ease: "expo.out"});
            tl.to(model.position, {duration: 1, y:-0.1, ease: "expo.out"}, '-=2');
            tl.to('.gallery-transition', { 
                marginTop: 0, marginLeft: 0, left: offset, top: offset, duration: 0.8, 
                opacity: 1, width: size, height: size,  ease: "expo.in"}, '-=2');
        }

    }

    onWindowResizeScene(event){
        console.log('resized')
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render( scene, camera );
    }

    eventListener(){
        return {
            mouseMove: {
                add: () => {
                    document.addEventListener('mousemove', onMouseMove, false);
                },
                remove: () => {
                    document.removeEventListener('mousemove', onMouseMove, false);
                }
            },
            mouseDown: {
                add: () => {
                    document.addEventListener('mousedown', onMouseDown, false);
                },
                remove: () => {
                    document.removeEventListener('mousedown', onMouseDown, false);
                }
            },
            resize: {
                add: () => {
                    console.log('ADD RESIZE');
                    window.addEventListener('resize', onWindowResizeScene, false);
                },
                remove: () => {
                    window.removeEventListener('resize', onWindowResizeScene, false);
                }
            }
        }
    }

};