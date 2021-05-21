
// Webpack imports
// Global var to use it across components
// import 'materialize-css/dist/js/materialize.min.js';
// import 'materialize-css/dist/css/materialize.min.css';
import '../scss/styles.scss';

// Class and Function Imports
import Main from './template.main';

// Class intialisation
let main = new Main();
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
};