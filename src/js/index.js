
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import ArticleList from './module.article-list';
//import TestList from "./tst-list";

// Class intialisation
let articleList = new ArticleList();



// Stand der Dinge
// devmiddleware eingebunden, test route steht
// hot module replacement noch nicht, kein Muss -> verstehen über gesamte YT reihe 

// window.startGallery = () => {
//     console.log('wieder am Start');
// }

window.onload = (event) => {

    console.log('The page has fully loaded');
    articleList.init();

    window.startGallery = () => {
        articleList.startGalleryFromStartPage();
    }

    //console.log('START TEST');

    // let tstd = new TestDefault(1, '/1', {'bla': 'default'}, 'Default');
    // let tstg = new TestGallery(2, '/2', {'bla': 'gallery'}, 'Gallery');

    // let testList = new TestList();
    // testList.init();

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