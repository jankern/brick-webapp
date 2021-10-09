
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import ArticleList from './module.article-list';
// import TestDefault from "./tst-default";
// import TestGallery from "./tst-gallery";

// Class intialisation
let articleList = new ArticleList();

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

window.startGallery = () => {
    console.log('wieder am Start');
}

window.onload = (event) => {

    console.log('The page has fully loaded');
    articleList.init();

    // console.log('START TEST');

    // let tstd = new TestDefault(1, '/1', {'bla': 'default'}, 'Default');
    // let tstg = new TestGallery(2, '/2', {'bla': 'gallery'}, 'Gallery');

    // console.log(tstd.anotherDefaultMethod());
    // console.log(tstd.createMethod());
    // console.log(tstd.updateMethod(5));
    // console.log(tstg.deleteMethod(6));
 
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