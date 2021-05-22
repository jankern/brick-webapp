
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import Main from './template.main';
import Gsap1 from './component.gsap1';

// Class intialisation
let main = new Main();
let gsap1 = new Gsap1();
let loaded = false;

// JQuery $(document).ready function 
//$(function() {

    //$('.tabs').tabs();
    // var elem = document.querySelector('.tabs');
    // var options = {};
    // var instance = M.Tabs.init(elem, options);

//});

// $(window).on('load', function () {
// 	console.log('loaded');
// 	loaded = true;
// 	//main.unloadProgressBar(1000);
// });

window.onload = (event) => {
    console.log('The page has fully loaded');
	console.log(main.out());
    console.log(gsap1.out());
    gsap1.runFirstAnimation();
};