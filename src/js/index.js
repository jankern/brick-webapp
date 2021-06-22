
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import Main from './template.main';
import Animations from './module.animations';
import Three3d from './module.three3d';
import HttpService from './module.http-service';

// Class intialisation
let main = new Main();
let animations = new Animations();
let three3d = new Three3d();
let httpService = new HttpService();
let loaded = false;

const viewAnimationOrder = {
    0: {
        func: () => {
            return animations.firstCall();
        }
    },
    1: {
        func: "secondCall"
    },
    2: {
        func: "thirdCall"
    }
};

let zIndexOrder = (elClass)=>{

}

// cluster -> brick -> variations

let gallery = {
    clusters: [
        {
            img: "",
            text: "",
            id: 1
        },
        {
            img: "",
            text: "",
            id: 2
        }
    ],
    bricks: [
        {
            img: "",
            text: "",
            id: 10,
            clusterId: 1
        },
        {
            img: "",
            text: "",
            id: 11,
            clusterId: 1
        },
        {
            img: "",
            text: "",
            id: 12,
            clusterId: 2
        }
    ],
    variants: [
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 30,
            bricksId: 10 
        },
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 31,
            bricksId: 10 
        },
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 32,
            bricksId: 11 
        },
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 33,
            bricksId: 11 
        },
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 34,
            bricksId: 12 
        },
        {
            ref: "",
            type: "img/file",
            text: "",
            id: 35,
            bricksId: 12 
        }
    ]
}

// let bla = () =>{
//     console.log('INSERT to me, next');
// }

// let blu = (foo) => {
//     console.log(foo);
// }

// let bli = (foo) => {
//     console.log(foo);

//     let ret = httpService.get().then(data => {
//                 console.log('in upper level');
//                 console.log(data);
//             });
// }

// Stand der Dinge
// devmiddleware eingebunden, test route steht
// hot module replacement noch nicht, kein Muss -> verstehen über gesamte YT reihe 

// document.querySelector('button#ani-timeline').addEventListener('click', () => {
//     bli('foo-uö');
//   });


window.addEventListener('resize', three3d.onWindowResize, false);

window.onload = (event) => {

    console.log('The page has fully loaded');

    // Page 1
    // start animation takes 5 seconds
    // font and spinning objects
    // create timeline 
    // and call callback when timeline is done

    // Transition 1


    three3d.init();















    // console.log(main.out());
    // console.log(animations.out());
    // animations.runFirstAnimation();

    // bla();

    //three3d.out();
    

    // setTimeout(()=>{
    //     let ret = httpService.get().then(data => {
    //         console.log('in upper level');
    //         console.log(data);
    //     });
    // }, 3000);

    //console.log(viewAnimationOrder[0].func())

    // Start screen with layer 1
    // start first animation for 3 seconds, after roll down the layer 2
    // layer 2 shows entire screen, canvas with object

    // click the object, objects tweens, when tween is done go to layer 3




    // document.getElementById("animate-btn").addEventListener("click", animations.runSecondAnimation); 
};

// HMR inclusion

// if (module.hot) {
//     console.log('HOT is true')
//     module.hot.accept(
//         //'./index.js',
//         // function(){
//         //     console.log("******** reloading self");
//         //     window.location.reload();
//         // }
//     )
// }