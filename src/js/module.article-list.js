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
        this.articleProperties;
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

        // test route
        path = "/rooms/fuchsia/brick1";
        articleId = "1M";
        // path = "/rooms/fuchsia";
        // articleId = "4";

        this.performUrlRouting(path, articleId, null);
        this.activeArticleId = 1;
        this.currentSlideDirection = "next";

        // Testcase für Seitenstart im Untermenü
        // this.performUrlRouting(window.location.pathname+'somewhere-to-b/and-to-the-b2-with-spice', '');
        this.onResizeSlide();
    }

    startGalleryFromStartPage(){
        console.log('in articleList to start gallery page');
        let galleryObject = ArticleDefault.getFirstChildOfArticleType(navigation, 'room');
        console.log(galleryObject)
        this.performUrlRouting(galleryObject.path, galleryObject.article_id, galleryObject.article_type);
    }

    onResizeSlide(){
        window.onresize = (e) => {
            this.resizeSlides();
        }
    }

    resizeSlides(){
        let slideContainerElement = document.querySelector('.rooms-container');
        if(slideContainerElement){

            let screenUnit = window.innerWidth;
            const childern = slideContainerElement.childNodes;

            // iterate over all child nodes to get the new overall width
            // and replace the container to the active screen
            let index = 0;
            let containerOffset = '0px'
            childern.forEach(el => {
                if(el.className.indexOf('redirect') <= -1){
                    if(el.id === "article-"+this.activeArticleId){
                        let offset = screenUnit*index;
                        containerOffset = '-'+offset+'px';
                    }
                    index += 1;
                }
            });

            slideContainerElement.style.width = (screenUnit*index)+'px';
            slideContainerElement.style.left = containerOffset;
                    
        }
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

    organizeArticleStack_(articleId) {

        console.log('ORGANIZEARTICLESTACK '+articleId);

        //let childrenObj = Util.getElementChildren('main');
        let count = Util.getElementsByTagAndClass('div', 'page').length;

        // let iteratorMax = childrenObj.count - 1 + 10;
        let iteratorMax = count - 1 + 10;
        let iterator = iteratorMax - 1;

        // console.log(iteratorMax);
        // console.log(iterator);
        
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

    organizeArticleStack(articleId) {

        let count = Util.getElementsByTagAndClass('div', 'page').length;
        let iterator = count - 1;

        let article = this.getArticleById(articleId);
        let articleType = article.getArticleType();

        if(articles.length > 0){

            for(let i in articles){
                if(articles.hasOwnProperty(i)){
                    if(articles[i].articleId === articleId){
                        articles[i].setZIndex(articles.length-1);
                        articles[i].setDisplay('flex');
                    }else{
                        if(articleType === 'room'){
                            if(articles[i].getArticleType() === "room"){
                                articles[i].setZIndex(iterator-1);
                                articles[i].setDisplay('flex');
                                iterator -= 1;
                            }else{
                                articles[i].setZIndex(0);
                                articles[i].setDisplay('none');
                            }
                        }else{
                            articles[i].setZIndex(iterator-1);
                            iterator -= 1;
                            articles[i].setDisplay('none');
                        }
                    }
                }
            }
        }
    }

    getState(){
        return history.state;
    }

    goToState(path){
        history.go(path);
    }

    getArticleById(articleId){
        for (let i in articles) {
            if (articles.hasOwnProperty(i)) {
                if (articles[i].getArticleId() === articleId) {
                    return articles[i];
                }
            }
        }
        return false;
    }

    getArticlesByType(type){
        let typedArticles = [];
        for (let i in articles) {
            if (articles.hasOwnProperty(i)) {
                if (articles[i].getArticleType() === type) {
                    typedArticles.push(articles[i]);
                }
            }
        }
        return typedArticles;
    }

    performUrlRouting(path, articleId, artType, popState = false) {

        let hasArticle = false;
        let redirectionId;

        // If article already exists, don't recall
        for (let i in articles) {
            if (articles.hasOwnProperty(i)) {
                if (articles[i].getArticleId() === articleId) {
                    hasArticle = true;
                    // when a redirection target is defined, target the redirection artcile
                    if (articles[i].getRedirectionId()){
                        redirectionId = articles[i].getRedirectionId();
                    }
                    // Update pushState only if pressing a link to an already
                    // existing article AND NOT coming from popState event (history <- ->)!
                    if(!popState){
                        // set the state to the redirection article
                        if(redirectionId){
                            this.getArticleById(redirectionId).updateState();
                        }else{
                            // target the regular existing article
                            articles[i].updateState();
                        }
                    }
                    break;
                }
            }
        }

        // TODO: was machen die hier? nur bei Startseite?
        this.suspendStartPageAnimation(path);
        this.resumeStartPageAnimation(path);

        // Get the current article type based on navigation object
        // default, room, roomitem
        if(artType === null || !artType){
            artType = "default";
            if(path.indexOf('rooms') > -1){
                path = path.replace('./', '/'); 
                let articleNav = ArticleDefault.getArticleRefByPath(navigation, path);
                artType = articleNav.article_type;
                //console.log(articleNav);
            }
        }

        // Define the progress type by artType and url pattern of the previous page
        // default or room / roomitem type
        let progressType = "default";
        if(this.getPreviousState() === undefined){
            // page direct start
        }else{
            // room: /rooms/x
            if(/\/rooms\/[^.]+/.test(this.getPreviousState().path)){
            
            // roomitem: /rooms/x/x
            }else if(/\/rooms\/[^.]+\/[^.]+/.test(this.getPreviousState().path)){

            }
        }

        document.querySelector('header .logo').style.opacity = '1';

        // If article does not exist, insert an empty article, call data from server and insert them into the view
        if (!hasArticle) {

            // If a previous request ist still ongoing, block the current one.
            if(isRequestOngoing){
                console.warn('Too much requests at a time. Blocked.');
                return;
            }

            // Initialise article properties
            // let properties = {};
            let properties = this.getArticleProperties(path);
            let previousArticleType = this.getPreviousArticleType(this.activeArticleId);

            // let articleNav = ArticleDefault.getArticleRefByPath(navigation, path);
            // properties = articleNav;

            // TODO properties to this
            // TODO for
            // TODO not needed anymore once its store to this.properties
            // let previousArticle = this.getArticleById(this.activeArticleId);
            // let previousArticleType = "";
            // if(previousArticle){
            //     previousArticleType = previousArticle.getArticleType();
            // }

            properties['previousArticleType'] = previousArticleType;
            properties['current_slider_direction'] = this.currentSlideDirection;

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

                        // Version with replacing the parent with the redirected Child - creates trouble
                        // if(articleId !== succ.data.article_id){
                        //     article.setArticlePropertiesAfterRedirect(succ.data.article_id);
                        // }

                        succContent = succ.data;

                        // IN case of rewrite, create the empty parent and right after the redirected child
                        if(articleId !== succContent.article_id){

                            // mark parent as redirected
                            article.setRedirectionId(succContent.article_id);
                            articles.push(article);
                            
                            if(!this.getArticleById(succContent.article_id)){

                                // create a new one with same artType and new id/path
                                let articleNavRef = ArticleDefault.getArticleRefById(navigation, succContent.article_id);
                                path = articleNavRef.path;
                                articleId = articleNavRef.article_id;
                                properties = articleNavRef;
                                
                                let redirectedArticle = articleTypeInstance[artType](articleId, path, properties);
                                redirectedArticle.createElememt();
                                redirectedArticle.updateElement(succContent);

                                // Assign progress element to the redirected target article  
                                redirectedArticle.reattachTransitionElement();
                                articles.push(redirectedArticle);

                                redirectedArticle.finishTransition(this.getPreviousState());
                            }else{
                                // resize the slide container if a redirected article was inserted
                                if(article.getArticleType() === 'room'){
                                    this.resizeSlides(); 
                                }
                                article.finishTransition(this.getPreviousState());
                                this.organizeArticleStack(succContent.article_id);
                                this.setPreviousState(path, succContent.article_id);
                            }

                        }else{

                            article.updateElement(succContent);
                            // Pushing all instances to an array
                            articles.push(article);
                            article.finishTransition(this.getPreviousState());
                        }
                    }

                    // TODO call and TEST organizeArticleStack to hide inactive articles

                    
                    isRequestOngoing = false;
                    this.activeArticleId = articleId;
                    // console.log('PREVIOUSSTAE');
                    // console.log(this.getPreviousState());
                    this.organizeArticleStack(articleId);
                    this.setPreviousState(path, articleId);

                    console.log('ARTICLES');
                    console.log(articles);
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

            if(redirectionId){
                articleId = redirectionId;
            }

            if(artType === "room"){
                animation.slideRoomAnimation(articleId);
            }

            if(artType === "roomitem"){
                let roomItemTransition = document.querySelector('.room-item-transition');
                if(roomItemTransition){
                    roomItemTransition.style.display = 'none';
                }
            }

            this.activeArticleId = articleId;
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

    getArticleProperties(path){
        let articleProperties = {};
        let articleNav = ArticleDefault.getArticleRefByPath(navigation, path);

        for(let i in articleNav){
            if(articleNav.hasOwnProperty(i)){
                articleProperties[i] = articleNav[i];
            }
        }
        return articleProperties;
    }

    getPreviousArticleType(activeArticleId){
        let previousArticle = this.getArticleById(activeArticleId);
        let previousArticleType = previousArticle ? previousArticle.getArticleType() : "";

        return previousArticleType;
    }
    
    // <a> interceptor to get the link event and prevent page laoding
    interceptLinkEvent(event) {

        let href;
        let articleNav;
        let target = event.target || event.srcElement;

        if (target.tagName !== 'A') {
            if(target.closest('A')){
                target = target.closest('A');
            }
        }

        if(target.getAttribute('data-link-type') !== "article"){
            return;
        }

        event.preventDefault();

        if (target.tagName === 'A') {

            // TODO maybe check if <a> comes from menu or gallery. Probably needs different handling
            href = target.getAttribute('href');
            href = href.replace('./', '/'); 

            if(target.className.indexOf('next') > -1){
                this.currentSlideDirection = "next";
            }else if(target.className.indexOf('previous') > -1){
                this.currentSlideDirection = "previous";
            }else if(target.className.indexOf('parent') > -1){
                this.currentSlideDirection = "parent";
            }

            let articleNav = ArticleDefault.getArticleRefByPath(navigation, href);

            let previousArticleType = this.getPreviousArticleType(this.activeArticleId);

            // Create a promise to wait for the transition animation until it's done
            // Then call next article
            if(target.dataset.articleType === 'roomitem' && previousArticleType === 'room'){
                animation.transitionChaining().run(animation.roomItemTransitionAnimation, {"article_id": articleNav.article_id}).then(
                    (succ) => {
                        this.performUrlRouting(href, articleNav.article_id, articleNav.article_type); 
                    }
                );
            }else{
                this.performUrlRouting(href, articleNav.article_id, articleNav.article_type);   
            }
            
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