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
        
        // /
        // /home -> Startpage ohne animation / reload threejs
        // /path -> service/divlayer (json)

        // bei / start der Anfangs Ani-Promises

        console.log('in init');
        menuToggle = true;

        // Event listener
        this.registerEventListener();

        // Routing manager
        let aId = window.location.pathname === "/" ? "1" : "";
        this.performUrlRouting(window.location.pathname, aId);

        // Testcase für Seitenstart im Untermenü
        // this.performUrlRouting(window.location.pathname+'somewhere-to-b/and-to-the-b2-with-spice', '');

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

        let iteratorMax = elCount + 10;
        let iterator = iteratorMax - 1;

        if(pageLayer.length > 0){
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

        let navMenu = document.querySelector('nav.view-wrapper');
        navMenu.style.zIndex = iteratorMax + 10;
        
    }

    // Async method to route and load content
    performUrlRouting(path, artId, title=""){

        let params = artId !== "" ? {"article_id": artId} : {"get_aid_by_nav": encodeURI(path)};

        httpService.requestChaining().call(httpService.get, params).then(
            (succ) => {

                // recall case - menu had been called before the get the article id, article can be called now
                if(succ.status_message && succ.status_message === "found_article_id"){
                    params = null;
                    params = {"article_id": succ.data};
                }

                 // regular case - article id is avilable and can be called directly
                httpService.requestChaining().call(httpService.get, params, true); // true = recall
                
            },
            (err) => {
                console.log(err);
                // TODO react on reject 400/404/500 etc
            }
        ).then(
            (succ) => {
                console.log(succ);
                // TODO - 
                // 1. add reponse to state object
                // 2. add response to html
                // 3. create html div container and append to page

                // Fill browser history state
                // history.pushState({view: this.extractPath(path), path: path, artId: artId}, title, path);

                // extract last path node
                // this.displayPageLayer(this.extractPath(path));
            },
            (err) => {
                console.log(err);
                // TODO react on reject 400/404/500 etc
            }
        );

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
        let artId;
        let target = event.target || event.srcElement;
        
        if (target.tagName === 'A') {

            href = target.getAttribute('href');
            artId = !target.getAttribute('data-article-id') ? null : target.getAttribute('data-article-id');
            console.log('extract data attr');
            console.log(artId)
            this.performUrlRouting(href, artId);

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