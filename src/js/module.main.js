/*
 *  Class Main
 */

// Class and Function Imports
import Animations from './module.animations';
import Three3d from './module.three3d';
import HttpService from './module.http-service';

// Class intialisation
let animations = new Animations();
let three3d = new Three3d();
let httpService = new HttpService();

let menuToggle;

export
    default class Main {

    constructor() {

    }

    init(){
       
        // Event listener

        // Routing manager
        // /
        // /home -> Startpage ohne animation / reload threejs
        // /path -> service/divlayer (json)

        // bei / start der Anfangs Ani-Promises

        console.log('in init');
        menuToggle = true;

        /*

        let link = document.querySelector('#link');
        this.manageEventListener().onClick.add(link, (event) => {
            event.preventDefault();
            var theURL = window.location.pathname;
            console.log('lets update the url field'+theURL);
            window.history.pushState("object or string", "Title", "/new-url");
        });

        */

        this.registerEventListener();

    }

    displayPageLayer(elementId){

        console.log(elementId);

        let pageWrapper = document.querySelector('main');
        let children = pageWrapper.childNodes;
        let pageLayer = [];
        let elCount = 0;

        for( let i in children){
            if(children.hasOwnProperty(i)){
                if(children[i].nodeName === "DIV"){
                    let hasClass = children[i].className.search(/page/);
                    if(hasClass > 0){
                        pageLayer.push(children[i]);
                    }
                }
                elCount += 1;
            }
        }

        if(pageLayer.length > 0){
            let iteratorMax = elCount + 10;
            let iterator = iteratorMax - 1;
            for( let i in pageLayer){
                if(pageLayer.hasOwnProperty(i)){
                    if(pageLayer[i].id === elementId){
                        pageLayer[i].style.zIndex = iteratorMax;
                    }else{
                        pageLayer[i].style.zIndex = iterator;
                        iterator -= 1;
                    }
                }
            } 
        }
        
    }

    // Async method to route and load content
    performUrlRouting(path, title=""){

        // Fill browser history state
        history.pushState({view: this.extractPath(path), path: path}, title, path);

        // extract last path node
        this.displayPageLayer(this.extractPath(path));

    }

    extractPath(path){
        // extracts last ndoe from a given path
        // /sub/path -> path
        let extractedStringPosition = path.search(/[^\/]+(?=\/$|$)/); 
        return path.substr(extractedStringPosition, path.length);
    }

    // <a> interceptor to get the link event and prefent page laoding
    interceptLinkEvent(event){

        event.preventDefault();

        let href;
        let target = event.target || event.srcElement;
        
        if (target.tagName === 'A') {

            href = target.getAttribute('href');
            this.performUrlRouting(href);

        }

        // https://stackoverflow.com/questions/2136461/use-javascript-to-intercept-all-document-link-clicks
        // For nested elements such as a <span> inside of an <a> you can use .closest()
        // if (target.tagName !== 'a') target = target.closest('a');

    }

    registerEventListener(){

        // menu Listener
        let navMenu = document.querySelector('button.burger-nav-btn');
        this.manageEventListener().onClick.add(navMenu, (event) => {
            event.preventDefault();
            animations.buttonEventNavMenu(event, menuToggle);
            menuToggle = !menuToggle;
        });

        // <a> Listener
        this.manageEventListener().onClick.add(document, (event) => {this.interceptLinkEvent(event)});

        // popstate handler for browser history
        window.addEventListener("popstate", (event) => {
            let location = document.location;
            let state = event.state;

            if(state){
                console.log('go to: '+state.path);
                this.performUrlRouting(state.path);
            }else{
                console.log('go back to home');
                this.performUrlRouting('/');
            }
            
        });
    }

    manageEventListener(){

        return{
            onClick: {
                add: (target, callback) => {
                    console.log('adding click events');
                    target.addEventListener('click', callback, false);
                },
                remove: (target, callback) => {
                    target.removeEventListener('click', callback);
                }
            }
        }

    }

}