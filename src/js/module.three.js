/*
 *  Class Three.js
 */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let camera, scene, renderer;
let geometry, material, mesh;
let controls, pointLight, ambientLight, lightHelper, gridHelper;
let animate;

const gltfLoader = new GLTFLoader();

export
    default class Three {

    constructor() {
    }

    init(){

        console.log(window.innerWidth / window.innerHeight)

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.set(0.0, 0.08, 0.25);
    
        scene = new THREE.Scene();

        // let newQuaternion = new THREE.Quaternion();
        // THREE.Quaternion.slerp(camera.quaternion, 1, 9, 0.07);
        // camera.quaternion = newQuaternion;

        // loading modelel
        gltfLoader.load(
            "../assets/gltf/showroom.glb",
            (glb) => {

                // glb.scene.traverse( function( node ) {
                //     if ( node instanceof THREE.Mesh ) { 
                //       node.castShadow = true; 
                //       node.material.side = THREE.DoubleSide;
                //     }
                //   });

                const model = glb.scene;
                model.scale.set(1.5,1.9,1.5);
                model.rotation.x += 0.2;
                model.rotation.y += -0.8;
                model.position.x = 0.03;
                model.castShadow = true;
                model.receiveShadow = true;
               
                scene.add(model);
            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total * 100) + '%');
            }, 
            (err) => {
                console.log(err);
            }
        );

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(5,5,5);
        scene.add(light);

        /* ------------- HELPER ---------------- */
    
        // pointLight = new THREE.PointLight(pointLight);
        // pointLight.position.set(5,5,5);

        // ambientLight = new THREE.AmbientLight(0xffffff);
        // scene.add(pointLight, ambientLight);

        // lightHelper = new THREE.PointLightHelper(pointLight);
        // gridHelper = new THREE.GridHelper(gridHelper);
        // scene.add(lightHelper, gridHelper);

        /* ------------------------------------- */
    
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight ); //

        //controls = new OrbitControls(camera, renderer.domElement);

        animate = () => {
            requestAnimationFrame(animate);
            console.log('/////#######');
            //model.rotation.x += 0.01;
            //controls.update();
            renderer.render( scene, camera );  
        };

        animate();

        let parentLayer = document.querySelector('.view-wrapper.preload');
        parentLayer.appendChild( renderer.domElement );
        //document.body.appendChild( renderer.domElement );

    }

    callRenderer(){
        console.log('#######');
        renderer.render( scene, camera );
    }

    animation(time){

        mesh.rotation.x = time / 1500;
        mesh.rotation.y = time / 1000;
    
        renderer.render( scene, camera );

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