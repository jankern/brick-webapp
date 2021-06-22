/*
 *  Class Three.js
 */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import { gsap } from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin.js";

let camera, scene, renderer, textureLoader, texture;
let geometry, material, mesh;
let controls, pointLight, ambientLight, lightHelper, gridHelper;
let animate, moveCamera, onMouseDown, isMouseDown, onMouseMove, meshObjects, intersects;

const gltfLoader = new GLTFLoader();
const gui = new dat.GUI();

export
    default class Three3d {

    constructor() {
        gsap.registerPlugin(CSSPlugin/*, PixiPlugin, MotionPathPlugin*/);
    }

    init(){

        let x = -0.01;
        let y = -0.01;    
        let z = 0.00;
        let isCamMoving = false;
        isMouseDown = false;

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );    
        scene = new THREE.Scene();

        textureLoader = new THREE.TextureLoader();
        texture = textureLoader.load('../img/Cluster1.jpg');

        // loading model
        let model;

        gltfLoader.load(
            "../assets/gltf/showroom.glb",
            (glb) => {

                model = glb.scene;
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

                onMouseMove = (event) => {
                    if (isMouseDown) {
                        return;
                    }
            
                    event.preventDefault();

                    let isIntersected;
                    isIntersected = this.detectIntersectedModel(event, model);
                    
                    console.log(isIntersected);
                    let bg = document.querySelector('.perspective-bottom');

                    if (isIntersected) {
                        //model.material.color.set( 0xff0000 );
                        //let mesh = model.getObject3D('mesh');
                        // model.material.map = texture; 
                        
                        //bg.style.backgroundColor = 'red';
                        bg.classList.add('active');
                        bg.classList.remove('inactive');

                        //this.tl = gsap.timeline();
                        // this.tl.to(isIntersected[i].object.scale, 1, {x: 2})
                        // this.tl.to(isIntersected[i].object.scale, .5, {x: .5})
                        gsap.to(model.scale, 1, {x: 2.5, y:3, ease: "expo.out"})
                        //this.tl.to(model.scale, .5, {x: .5})
                        // this.tl.to(isIntersected[i].object.position, .5, {x: 2, ease: Expo.easeOut})
                        // this.tl.to(isIntersected[i].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut}, "=-1.5")
                    }else{
                        gsap.to(model.scale, 1, {x: 1.8, y:2, ease: "expo.out"});
                        bg.classList.add('inactive');
                        bg.classList.remove('active');
                    }
                }
            
                onMouseDown = (event) => {
                    event.preventDefault();
                    isMouseDown = true;
 
                    let isIntersected;
                    isIntersected = this.detectIntersectedModel(event, model);

                    model.click = () => {
                        console.log('Tuwas, biddee');
                        isCamMoving = true;
                        gsap.to(model.scale, 2, {x: 5, y:6, ease: "expo.out"});
                        gsap.to(model.position, 1, {y:-0.1, ease: "expo.out"})
                    }
        
                    console.log(isIntersected);
                    if (isIntersected) {
                       model.click();
                    }
                
                }

                document.addEventListener('mousedown', onMouseDown, false);
                document.addEventListener('mousemove', onMouseMove, false);

                //gsap.from(model, 3, {opacity: 0})
                //gsap.to(model.velocity, 3, {velocity: 1})
                gsap.from(model.scale, 3, {x: 1.6, ease: "expo.out"})
                gsap.to(model.scale, 3, {x: 1.8, ease: "expo.out"})
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

        //let light = new THREE.AmbientLight(0x404040);

        scene.add(light);

        /* ------------- HELPER ---------------- */
    
        // pointLight = new THREE.PointLight(0xffffff);
        // pointLight.position.set(0.5, 0.5, 0.5);

        // ambientLight = new THREE.AmbientLight(0xffffff);
        // pointLight.position.set(0.5,0.5,0.5);   

        // //scene.add(pointLight, ambientLight);
        // scene.add(ambientLight);

        //lightHelper = new THREE.PointLightHelper(pointLight);
        //gridHelper = new THREE.GridHelper(gridHelper);
        //scene.add(lightHelper, gridHelper);
        //scene.add(gridHelper);

        /* ------------------------------------- */
    
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setClearColor (0x000000, 0);
        renderer.setSize( window.innerWidth, window.innerHeight ); //

        // controls = new OrbitControls(camera, renderer.domElement);
        // controls.autoRotate = false;
        //camera.position.set(0.0, 0.08, 0.25);
        camera.position.set(-0.06, 0.04, 0.3);

        animate = () => {
            requestAnimationFrame(animate);
            
            if(isCamMoving && y > -0.12){
                this.moveCamera(camera, x, y, z);
                // x -= 0.01;
                // y -= 0.01;
                x += 0.01;
                y -= 0.02;
                z -= 0.02;
            }else{
                // isCamMoving = false;
                // camera.position.set(-0.05, 0.06, 0.3);
            }

            //controls.update();
            renderer.render( scene, camera );  
        };

        animate();

        let parentLayer = document.querySelector('.view-wrapper.preload');
        parentLayer.appendChild( renderer.domElement );
        //document.body.appendChild( renderer.domElement );

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

        const isIntersected = intersects.find(
            (intersectedEl) => intersectedEl.object.parent.uuid === model.uuid
        );

        return isIntersected;
    };

    moveCamera(camera, x, y, z){
        
        // console.log('x: '+x);
        // console.log('y: '+y);
        // console.log('z: '+z);
 
        // var x = 0.0 - x,
        // y = 0.08 + x, 
        // z = 0.25;

        var x = -0.05 - x,
        y = 0.06 + y, 
        z = 0.3 + z;

        //camera.position.set(0.0, 0.08, 0.25);

        // position property can be used to set
        // the position of a camera
        camera.position.set(x, y, z);
        // the rotation property or the lookAt method
        // can be used to set rotation
        camera.lookAt(0, 0, 0);
    }

    onWindowResize(){
        console.log('resized')
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render( scene, camera );
    }

};