/**
 * Class Article list
 * 
 */

import Util from './module.util';

import HttpService from './module.http-service';
let httpService = new HttpService();

import Animation from './module.animation';
let animation = new Animation();

import Three3d from './module.three-3d';
let three3d = new Three3d();

import ArticleDefault from './module.article-default';

let menuToggle, articles, state, isRequestOngoing, previousState, baseUrl;

export
    default class ArticleList {

    constructor() {

    }

    init() {

        menuToggle = true;

        // Event listener
        this.registerEventListener();

        // Article object list
        articles = Array();

        // Define base url
        baseUrl = Util.getBaseUrl();

        // Start proload sinning
        animation.preloadSpinning();

        // Routing manager
        let articleId = window.location.pathname === baseUrl ? "1" : "";
        let path = window.location.pathname;
        this.performUrlRouting(path, articleId);

        // Testcase für Seitenstart im Untermenü
        // this.performUrlRouting(window.location.pathname+'somewhere-to-b/and-to-the-b2-with-spice', '');

    }

    performStartPageLoading(path, article){

        // Fetch content from server
        let params = { "article_id": article.getArticleId() };

        httpService.requestChaining().call(httpService.get, params, true).then(
            (succ) => {
                article.updateElement(succ.data);
                isRequestOngoing = false;
                this.setPreviousState(path, article.getArticleId());
                this.manageEventListener().onMouseMove.add(window, animation.startPageClaimAnimation);

                // return animation transition
                return animation.transitionChaining().run(animation.preloadStartTransitionAnimation, {});
            }, 
            (err) => {
                isRequestOngoing = false;
                this.setPreviousState(path, article.getArticleId());
                return;
            }
        ).then(
            (result) => {
                
            }
        );
        
    }

    suspendStartPageAnimation(path){
        if(previousState){
            if(previousState.path === baseUrl && path !== baseUrl){
                three3d.suspendScene();
            }
        }
    }

    resumeStartPageAnimation(path){
        if(path === baseUrl && previousState){
            three3d.resumeScene();
        }
    }

    organizeArticleStack(articleId) {

        let childrenObj = Util.getElementChildren('main');

        let iteratorMax = childrenObj.count - 1 + 10;
        let iterator = iteratorMax - 1;

        if(articles.length > 0){
            for(let i in articles){
                if(articles.hasOwnProperty(i)){
                    if(articles[i].articleId === articleId){
                        articles[i].setZIndex(iteratorMax);
                    }else{
                        articles[i].setZIndex(iterator);
                        iterator -= 1;
                    }
                }
            }
        }

        let navMenu = document.querySelector('nav.view-wrapper');
        navMenu.style.zIndex = iteratorMax + 10;

    }

    getState(){
        return history.state;
    }

    goToState(path){
        history.go(path);
    }

    performUrlRouting(path, articleId, popState = false) {

        let hasArticle = false;

        // If article already exists, don't recall
        for (let i in articles) {
            if (articles.hasOwnProperty(i)) {
                if (articles[i].getArticleId() === articleId) {
                    hasArticle = true;
                    // Update pushState only if pressing a link to an already
                    // existing article AND NOT coming from popState event (history <- ->)!
                    if(!popState){
                        articles[i].updateState();
                    }
                    break;
                }
            }
        }

        this.suspendStartPageAnimation(path);
        this.resumeStartPageAnimation(path);

        // If article does not exist, insert an empty article, call data from server and insert them into the view
        if (!hasArticle) {

            // If a previous request ist still ongoing, block the current one.
            if(isRequestOngoing){
                console.warn('Too much requests at a time. Blocked.');
                return;
            }

            // Initialise article properties
            let properties = {};
            if(path === baseUrl){
                properties.backgroundColor = "#373737";
            }

            // Create article object
            let article = new ArticleDefault(articleId, path, properties);
            article.createElememt();
            article.doTransition();
            // Pushing all instances to an array
            articles.push(article);
            isRequestOngoing = true;

            // If start page is called for the first time, stop here and go to a specific start page loading procedure
            if(path === baseUrl){
                this.performStartPageLoading(path, article);
                return;
            }

            // Fetch content from server
            let params = articleId !== "" ? { "article_id": articleId } : { "get_aid_by_nav": Util.replaceBaseUrl(baseUrl, path) };

            httpService.requestChaining().call(httpService.get, params).then(
                (succ) => {

                    // recall case - menu had been called before the get the article id, article can be called now
                    if (succ.status_message && succ.status_message === "found_article_id") {
                        params = null;
                        params = { "article_id": succ.data };
                    }

                    // regular case - article id is avilable and can be called directly
                    return httpService.requestChaining().call(httpService.get, params, true) // true = recall, doesn'T stop while first Nav request

                },
                (err) => {
                    console.log(err);
                    // TODO react on reject 400/404/500 etc
                }
            ).then(
                (succ) => {
                    article.updateElement(succ.data);
                    isRequestOngoing = false;
                    article.finishTransition(this.getPreviousState());
                    this.setPreviousState(path, articleId);
                },
                (err) => {
                    console.log(err);
                    isRequestOngoing = false;
                    article.finishTransition(this.getPreviousState());
                    this.setPreviousState(path, articleId);
                    // TODO react on reject 400/404/500 etc
                }
            );
        }else{
            this.organizeArticleStack(articleId);
            this.setPreviousState(path, articleId);
        }

    }

    setPreviousState(path, articleId){
        previousState = {path: path, articleId: articleId};
    }

    getPreviousState(){
        return previousState;
    }

    // <a> interceptor to get the link event and prevent page laoding
    interceptLinkEvent(event) {

        event.preventDefault();

        let href;
        let artId;
        let target = event.target || event.srcElement;

        if (target.tagName === 'A') {

            // TODO maybe check if <a> comes from menu or gallery. Probably needs different handling
            href = target.getAttribute('href');
            artId = !target.getAttribute('data-article-id') ? null : target.getAttribute('data-article-id');
            if(href === "./") {
                href = '/';
            }
            this.performUrlRouting(href, artId);
            // Swipe out menu
            if(!menuToggle){
                animation.swipeOutNavMenu(menuToggle);
                menuToggle = !menuToggle;
            }

        }

        // https://stackoverflow.com/questions/2136461/use-javascript-to-intercept-all-document-link-clicks
        // For nested elements such as a <span> inside of an <a> you can use .closest()
        // if (target.tagName !== 'a') target = target.closest('a');

    }

    registerEventListener() {

        // menu Listener
        let navMenu = document.querySelector('button.burger-nav-btn');
        this.manageEventListener().onClick.add(navMenu, (event) => {
            event.preventDefault();
            animation.buttonEventNavMenu(event, menuToggle);
            menuToggle = !menuToggle;
        });

        // <a> Listener
        this.manageEventListener().onClick.add(document, (event) => { this.interceptLinkEvent(event) });

        // popstate handler for browser history
        window.addEventListener("popstate", (event) => {
            state = event.state;

            // When previous state exists re-call article id and path
            if (state) {
                let articleId = !state.articleId ? '1' : state.articleId;
                this.performUrlRouting(state.path, articleId, true);
            } else {
                this.performUrlRouting('./', '1', true);
            }

            // In case menu is open, close it 
            if(!menuToggle){
                animation.swipeOutNavMenu(menuToggle);
                menuToggle = !menuToggle;
            }

        });
    }

    manageEventListener() {

        return {
            onClick: {
                add: (target, callback) => {
                    target.addEventListener('click', callback, false);
                },
                remove: (target, callback) => {
                    target.removeEventListener('click', callback);
                }
            },
            onMouseMove: {
                add: (target, callback) => {
                    target.addEventListener('mousemove', callback, false)
                },
                remove: (target, callback) => {
                    target.removeEventListener('mousemove', callback)
                }
            }
        }

    }

}