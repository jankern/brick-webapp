/*
 *  Class Three.js
 */
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let camera, scene, renderer;
let geometry, material, mesh;
const gltfLoader = new GLTFLoader();

export
    default class Three {

    constructor() {
        
    }

    init(){

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = .2;
    
        scene = new THREE.Scene();

        // loading model
        gltfLoader.load(
            "../assets/gltf/showroom.glb",
            (glb) => {
                //console.log(gltf.scene);
                let mod = glb.scene;
                mod.scale.set(1.5,1.5,1.5);
                scene.add(mod);
            },
            (xhr) => {
                console.log((xhr.loaded/xhr.total * 100) + '%');
            }, 
            (err) => {
                console.log(err);
            }
        );

        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(2,2,5);
        scene.add(light);
    
        geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
        material = new THREE.MeshNormalMaterial();
    
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
    
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setAnimationLoop( this.animation );
        //this.animate();

        //renderer.render( scene, camera );
        document.body.appendChild( renderer.domElement );

    }

    animation(time){

        mesh.rotation.x = time / 1500;
        mesh.rotation.y = time / 1000;
    
        renderer.render( scene, camera );

    }

    animate(){

        requestAnimationFrame(animate);
        renderer.render( scene, camera );

    }

    out(){
        //console.log(THREE);
        console.log('Starting three.js');
        this.init();
    }

}