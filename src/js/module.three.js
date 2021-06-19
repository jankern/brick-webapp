/*
 *  Class Three.js
 */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

let camera, scene, renderer;
let geometry, material, mesh;
let controls, pointLight, ambientLight, lightHelper, gridHelper;
let animate, moveCamera, onDocumentMouseDown, meshObjects, intersects;

const gltfLoader = new GLTFLoader();
const gui = new dat.GUI();

export
    default class Three {

    constructor() {
    }

    init(){

        // let x = 0.01;
        // let y = 0.09;    
        // let z = 0.01;
        let x = -0.01;
        let y = -0.01;    
        let z = 0.00;
        let isCamMoving = false;

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );    
        scene = new THREE.Scene();

        // loading model
        let model;

        gltfLoader.load(
            "../assets/gltf/showroom.glb",
            (glb) => {

                model = glb.scene;
                model.scale.set(1.5,1.9,1.5);
                //model.rotation.x += 0.2;
                model.rotation.y += -0.8;

                model.position.z = 0.05;
                model.position.y = -0.05;

                // model.castShadow = true;
                // model.receiveShadow = true;

                scene.add(model);

                let raycaster = new THREE.Raycaster();
                let mouse = new THREE.Vector2();
            
                onDocumentMouseDown = (event) => {
                    event.preventDefault();
            
                    // mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
                    // mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

                    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            
                    raycaster.setFromCamera(mouse, camera);
            
                    intersects = raycaster.intersectObjects(scene.children, true);

                    for(let i in intersects){
                        console.log(intersects[i])
                    }

                    model.click = () => {
                        console.log('Tuwas, biddee');
                        isCamMoving = true;
                    }

                    const isIntersected = intersects.find(
                        (intersectedEl) => intersectedEl.object.parent.uuid === model.uuid
                    );
        
                    console.log(isIntersected);
                    if (isIntersected) {
                       model.click();
                    }
                
                }

                document.addEventListener('mousedown', onDocumentMouseDown, false);
            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total * 100) + '%');
            }, 
            (err) => {
                console.log(err);
            }
        );

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(5,2,5);
        scene.add(light);

        /* ------------- HELPER ---------------- */
    
        // pointLight = new THREE.PointLight(0xffffff);
        // pointLight.position.set(0.5, 0.5, 0.5);

        // ambientLight = new THREE.AmbientLight(0xffffff);
        // pointLight.position.set(0.5,0.5,0.5);   

        // //scene.add(pointLight, ambientLight);
        // scene.add(ambientLight);

        //lightHelper = new THREE.PointLightHelper(pointLight);
        gridHelper = new THREE.GridHelper(gridHelper);
        //scene.add(lightHelper, gridHelper);
        scene.add(gridHelper);

        /* ------------------------------------- */
    
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight ); //

        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false;
        camera.position.set(0.0, 0.08, 0.25);

        animate = () => {
            requestAnimationFrame(animate);
            
            if(isCamMoving && y > -0.12){
                this.moveCamera(camera, x, y, z);
                // x -= 0.01;
                // y -= 0.01;
                x += 0.01;
                y -= 0.01;
                z += 0.02;
            }

            controls.update();
            renderer.render( scene, camera );  

        };

        animate();

        let parentLayer = document.querySelector('.view-wrapper.preload');
        parentLayer.appendChild( renderer.domElement );
        //document.body.appendChild( renderer.domElement );

    }

    moveCamera(camera, x, y, z){
        
        console.log('x: '+x);
        console.log('y: '+y);
        console.log('z: '+z);
 
        // var x = 0.0 - x,
        // y = 0.08 + x, 
        // z = 0.25;

        var x = 0.0 - x,
        y = 0.08 + y, 
        z = 0.26;

        //camera.position.set(0.0, 0.08, 0.25);

        // position property can be used to set
        // the position of a camera
        camera.position.set(x, y, z);
        // the rotation property or the lookAt method
        // can be used to set rotation
        // camera.lookAt(0, 0, 0);
    }

    onWindowResize(){
        console.log('resized')
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render( scene, camera );
    }

    out(){
        console.log('Starting three.js');
        this.init();
    }

};