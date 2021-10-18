/**
 * Class Article list
 * 
 */

import Util from './module.util';
import HttpService from './module.http-service';
let httpService = new HttpService();

// singleton import
import {animation} from './module.animation';
import {three3d} from './module.three-3d';
import {navigation} from './module.navigation';

import {articles} from './module.articles';
import ArticleDefault from './module.article-default';
import ArticleRoom from './module.article-room';
import ArticleRoomItem from './module.article-room-item';

let menuToggle, state, isRequestOngoing, previousState, baseUrl;

export
    default class ArticleList {

    constructor() {

    }

    init() {

        menuToggle = true;

        // Event listener
        this.registerEventListener();

        // Define base url
        baseUrl = Util.getBaseUrl();

        // Start proload sinning
        animation.preloadSpinning();

        // Routing manager
        let articleId = window.location.pathname === baseUrl ? "1" : "";
        let path = window.location.pathname;
        this.performUrlRouting(path, articleId, null);

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
                articles.push(article);
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

    performUrlRouting(path, articleId, artType, popState = false) {

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

            // Create article object. Either from type default or room based on path
            let article;
            let articleTypeInstance = {
                "default": (articleId, path, properties) => {
                    return new ArticleDefault(articleId, path, properties);
                },
                "room": (articleId, path, properties) => {
                    return new ArticleRoom(articleId, path, properties);
                },
                "roomitem": (articleId, path, properties) => {
                    return new ArticleRoomItem(articleId, path, properties);
                }
            };

            console.log('++++++++++');

            if(artType === null || !artType){
                artType = "default";
                if(path.indexOf('rooms') > -1){
                    path = path.replace('./', '/'); 
                    console.log(path)
                    let articleNav = ArticleDefault.getArticleRefByPath(navigation, path);
                    console.log(articleNav);

                    artType = articleNav.article_type;
                    console.log(articleNav);
                }
            }

            // Initiate article object
            article = articleTypeInstance[artType](articleId, path, properties);
            article.createElememt();
            article.doTransition();

            isRequestOngoing = true;

            // If start page is called for the first time, stop here and go to a specific start page loading procedure
            if(path === baseUrl){
                this.performStartPageLoading(path, article);
                return;
            }

            // Fetch content from server
            let params = articleId !== "" ? { "article_id": articleId } : { "get_aid_by_nav": Util.replaceBaseUrl(baseUrl, path) };
            if(artType) params['article_type'] = artType;

            httpService.requestChaining().call(httpService.get, params).then(
                (succ) => {

                    // recall case - menu had been called before the get the article id, article can be called now
                    if (succ.status_message && succ.status_message === "found_article_id") {
                        params = {};
                        params['article_id'] = succ.data.article_id;
                        if(artType) params['article_type'] = artType;
                        // update article-list, article and article DOM object with remote article id
                        articleId = succ.data.article_id;
                        article.setArticlePropertiesAfterRemoteIdCall(articleId);
                    }

                    // regular case - article id is avilable and can be called directly
                    return httpService.requestChaining().call(httpService.get, params, true) // true = recall, doesn'T stop while first Nav request

                },
                (err) => {
                    // console.log(err);
                    // TODO react on reject 400/404/500 etc
                }
            ).then(
                (succ) => {
                    // In case of artid from request does not match object due to request redirect, 
                    // then update id and path in object
                    let succContent = {};
                    if(succ.status === 404){
                        succContent['text'] == "404";
                    }else{

                        if(articleId !== succ.data.article_id){
                            article.setArticlePropertiesAfterRedirect(succ.data.article_id);
                        }

                        succContent = succ.data;
                        
                        // Pushing all instances to an array
                        articles.push(article);
                    }

                    article.updateElement(succContent);
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
                    // TODO add article only here to articles array if still useful
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
        let artId, artType;
        let articleNav;
        let target = event.target || event.srcElement;

        if (target.tagName === 'A') {

            // TODO maybe check if <a> comes from menu or gallery. Probably needs different handling
            href = target.getAttribute('href');
            href = href.replace('./', '/'); 

            // artId = !target.getAttribute('data-article-id') ? null : target.getAttribute('data-article-id');
            // artType = !target.getAttribute('data-article-type') ? null : target.getAttribute('data-article-type');
            
            // if(!target.getAttribute('data-article-id')){
            //     artId = ArticleDefault.getArticleRefByPath(navigation, href).article_id;
            // }

            // if(!target.getAttribute('data-article-type')){
            //     artType = ArticleDefault.getArticleRefByPath(navigation, href).article_type;
            // }

            articleNav = ArticleDefault.getArticleRefByPath(navigation, href);

            //console.log(artId+' '+artType);

            this.performUrlRouting(href, articleNav.article_id, articleNav.article_type);
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
                this.performUrlRouting(state.path, articleId, null, true);
            } else {
                this.performUrlRouting('./', '1', null, true);
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