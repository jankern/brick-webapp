
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import ArticleList from './module.article-list';
// import Main from './module.main';
// import Animation from './module.animation';
// import Three3d from './module.three-3d';
// import HttpService from './module.http-service';

// Class intialisation
let articleList = new ArticleList();
// let main = new Main();
// let animation = new Animation();
// let three3d = new Three3d();
// let httpService = new HttpService();
// let loaded = false;

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


// Stand der Dinge
// devmiddleware eingebunden, test route steht
// hot module replacement noch nicht, kein Muss -> verstehen über gesamte YT reihe 

// document.querySelector('button#ani-timeline').addEventListener('click', () => {
//     bli('foo-uö');
//   });


window.startGallery = () => {
    console.log('wieder am Start');
}

window.onload = (event) => {

    console.log('The page has fully loaded');
    // let menuToggle = true;

    // assign event listener
    // let navMenu = document.querySelector('button.burger-nav-btn');
    // navMenu.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     animation.buttonEventNavMenu(event, menuToggle);
    //     menuToggle = !menuToggle;
    //     console.log(menuToggle);
    // });

    // main.init();
    articleList.init();


    let animationPromise = (callback) => {
        let p  = new Promise(
            (resolve, reject) => {
                return callback(resolve, reject);
            }
        );
        return p;
    }

    // animationPromise(animation.preloadAnimation).then((result) => {
    //     return animationPromise(animation.preloadTransitionAnimation);
    // });

    // .then((result) => {
    //     return animationPromise(4000, animation.animationPromise1);
    // }).then((result) => {
    //     return animationPromise(2000, animation.animationPromise1);
    // })

    // let btnStart = document.querySelector('#starts');
    // btnStart.addEventListener('click', () => {three3d.resumeScene()}, false)
    // let btnStop = document.querySelector('#stops');
    // btnStop.addEventListener('click', () => {three3d.suspendScene()}, false)

    // Page 1
    // start animation takes 5 seconds
    // font and spinning objects
    // create timeline 
    // and call callback when timeline is done

    // Transition 1


    //three3d.init();

    // setTimeout(()=>{
    //     let ret = httpService.get().then(data => {
    //         console.log('in upper level');
    //         console.log(data);
    //     });
    // }, 3000);

 
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