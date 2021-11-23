/**
 * Class Article
 * 
 */

 import Util from './module.util';
 // Singleton import
 import {animation} from './module.animation';
 import {navigation} from './module.navigation';

 import Article from './module.article';
 import {articles} from './module.articles';

 let articleElement, progressElement, mainElement;

 export 
    default class ArticleRoom extends Article {

        constructor(articleId, path, prop){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};
            this.type = 'room';
            //this.zIndex = 10;
        }

        createElememt(){

            document.querySelector('body').className = 'article';
            let count = Util.getElementsByTagAndClass('div', 'page').length;

            // Create the room element
            this.articleElement = document.createElement('div');
            this.articleElement.id = 'article-'+this.articleId;
            this.articleElement.className = "view-wrapper page room";
            this.articleElement.style.zIndex = this.zIndex + count;
            let bgColor = this.prop.backgroundColor ? this.prop.backgroundColor : Util.getRandomColor();
            this.articleElement.style.backgroundColor = bgColor;
            this.zIndex = this.zIndex + count;

            // Check how many rooms exist already without redirect flag
            let countAllRoomsArticle = 0;
            let countRoomsArticle = 0;
            let existingRoomArticles = [];
            for(let i in articles){
                if(articles.hasOwnProperty(i)){
                    if(articles[i].type === "room"){ 
                        countAllRoomsArticle += 1; // forward articles included // TODO reset with existingRoomArticles.length
                        if(!articles[i].redirectionId){
                            countRoomsArticle += 1; // TODO reset with existingRoomArticles.length
                            existingRoomArticles.push(articles[i]);
                        }
                    }
                }
            }

            // Create rooms container when very first room is initiated
            mainElement = document.querySelector('main');
            let roomsContainerElement;
            let positions = [];
            let status = {};

            // Create
            if(countAllRoomsArticle < 1){ // TODO reset with existingRoomArticles.length
                roomsContainerElement = document.createElement('div');
                roomsContainerElement.className = "rooms-container";
                mainElement.appendChild(roomsContainerElement);
            }else{

                // Resize the rooms container based on the inner rooms
                roomsContainerElement = document.querySelector('.rooms-container');
                if(countRoomsArticle >= 1){

                    let insertPosition = 0;

                    // The insert position within the container and between its items has to be determined
                    // get all rooms from navigation and compare them with the existing ones
                    // if the current article comes first of the existing ones, current article
                    // has to be inserted prior the first existing one

                    if(existingRoomArticles.length > 0){

                        let navigationRoomArticles = {};
                        for (let key in navigation){
                            if(navigation.hasOwnProperty(key)){
                                if (typeof navigation[key] == "object") {
                                    if(navigation[key].path === "/rooms"){
                                        if(navigation[key].articles){
                                            navigationRoomArticles = navigation[key].articles;
                                        }
                                    }
                                }
                            }
                        }

                        let foundArticleId = false;

                        for (let key1 in existingRoomArticles){
                            if(existingRoomArticles.hasOwnProperty(key1)){

                                foundArticleId = false;
                                let distanceToNextArticle = 0;
                                let navigationIndex = 0;

                                for (let key2 in navigationRoomArticles){
                                    if(navigationRoomArticles.hasOwnProperty(key2)){

                                        if(existingRoomArticles[key1].articleId === key2){
                                            // Mark existing article with navigation index to determine the navigation/dom order
                                            existingRoomArticles[key1].setOrderIndex(navigationIndex);
                                            // Found new article id in navigation prior existing one
                                            if(foundArticleId){
                                                // Store the article right from the current one and the distance
                                                let obj = {};
                                                obj.nextId = key2;
                                                obj.distance = distanceToNextArticle;
                                                positions.push(obj);
                                            }
                                            break;
                                        }

                                        if(this.articleId === key2){
                                            foundArticleId = true;
                                        }

                                        // iterate the distance from the current article to the navigation position
                                        if(foundArticleId) distanceToNextArticle += 1;

                                        navigationIndex += 1;
                                    }
                                }
                            }
                        }
                         
                        if(positions.length > 0){

                            // Sort existing articles in order of navigation
                            existingRoomArticles.sort((a, b) => {
                                return a.orderIndex - b.orderIndex;
                            });

                            // Reduce to smallest position value to find next close article
                            // store closest next article to teh status object
                            status = positions.reduce((previousValue, currentValue, index, array) => {
                                return (currentValue.distance < previousValue.distance ? currentValue : previousValue);
                            });
                            status.mode = 'insertBefore';

                            // With the same order of positions array the insert position of the new article can be set
                            for(let j = 0; j < existingRoomArticles.length; j++){
                                if(existingRoomArticles[j].articleId === status.nextId){
                                    insertPosition = j;
                                }
                            }

                        }

                        // In case no prior order has been detected, just append the new article
                        if(!status['mode']){
                            status['mode'] = 'appendChild';
                        }
                    }

                    // Container size / width
                    let width = (window.innerWidth * (countRoomsArticle+1)) + 'px';
                    roomsContainerElement.style.width = width;
                }
                
            }

            // Use status object to determine next article to insert current before
            // or just append
            if(status['mode'] === "appendChild" || !status['mode']){
                roomsContainerElement.appendChild(this.articleElement);
            }else if(status['mode'] === "insertBefore"){
                let existingArticleElement = document.querySelector('#article-'+status['nextId']);
                //console.log(existingArticleElement)
                roomsContainerElement.insertBefore(this.articleElement, existingArticleElement);
            }

            this.nextBtn = document.createElement('div');
            this.nextBtn.className = 'gallery_navigate gallery-next';
            this.nextBtn.innerHTML = '<a href="#" class="material-icons next" data-link-type="article">navigate_next</a>'+
                '<div class="tool-tip-title"></div>';

            this.previousBtn = document.createElement('div');
            this.previousBtn.className = 'gallery_navigate gallery-previous';
            this.previousBtn.innerHTML = '<a href="#" class="material-icons previous" data-link-type="article">navigate_before</a>'+
            '<div class="tool-tip-title"></div>';

            this.articleElement.appendChild(this.nextBtn);
            this.articleElement.appendChild(this.previousBtn);

            animation.slideRoomAnimation(this.getArticleId(), true);
            animation.animateSlideButton(this.getArticleId());

            progressElement = document.querySelector('.view-wrapper.preload');

        }

        updateElement(content){
        
            // generate html content for the room item list
            let tplItems = '<h1>'+content.name+'</h1><p>'+content.text+'</p><div class="room-item-list">';
            if(content.items.length > 0){
                content.items.forEach(element => {
                    let nav = Article.getArticleRefById(navigation, element.article_id)
                    tplItems += '<a href="'+nav.path+'" data-article-id="'+nav.article_id+
                        '" data-article-type="roomitem" data-link-type="article"><div class="room-item" id="room-item-'+nav.article_id+'"><div class="item-container" style="background-image:url(\''+element.img.toString()+'\')"></div></div></a>';
                });
            }
            tplItems += '</div>';

            // add the list to the DOM
            let contentElement = document.createElement('div');
            contentElement.className = 'content';
            contentElement.innerHTML = tplItems;
            this.articleElement.appendChild(contentElement);
            
            // create the previous / next nav buttons and hide/show if a next room is clickable
            // Article.nextLimit = 0;
            // TODO language based replacement for link name
            let next = Article.getNextSubArtRefById(navigation, '', 3, content.article_id); // depth level 3=room, 5=roomitems
            if(next){
                let a = this.nextBtn.firstChild;
                if(a.nodeName === 'A'){
                    a.href = next.path;
                }
                let d = this.nextBtn.lastElementChild;
                if(d.nodeName === 'DIV'){
                    d.innerHTML = "Go to brick '"+next.name+"'";
                }
                let cl = this.nextBtn.className;
                this.nextBtn.className = cl+' add-opacity';
            }
            let previous = Article.getPreviousSubArtRefById(navigation, '', 3, content.article_id); // 3=room, 5=roomitems´
            console.log('PREVIOUS ROOM');
            console.log(content.article_id);
            console.log(previous);
            if(previous){
                let a = this.previousBtn.firstChild;
                if(a.nodeName === 'A'){
                    a.href = previous.path;
                }
                let d = this.previousBtn.lastElementChild;
                if(d.nodeName === 'DIV'){
                    d.innerHTML = "Go to brick '"+previous.name+"'";
                }
                let cl = this.previousBtn.className;
                this.previousBtn.className = cl+' add-opacity';
            }

            this.updateState();
        }

        doTransition(){

            // Start pf the page
            if (articles.length < 1 || this.prop['slide'] === undefined){

                progressElement.style.display = 'block';
                progressElement.style.height = '100vh';
                mainElement.appendChild(progressElement);
                animation.defaultPreloadDisplayAnimation();

            }else{
                // slide case
                if(this.prop !== undefined){
                    if(this.prop['slide']){
                        this.articleElement.appendChild(progressElement);
                        animation.roomPreloadDisplayAnimation();

                    }
                }

            }

        }

        reattachTransitionElement(){

            // mainElement.appendChild(progressElement);
            // console.log('progress element attached ');
            // console.log(progressElement);
        }

        finishTransition(previousArticle){

            // slide case
            if(this.prop !== undefined){
                if(this.prop['slide']){
                    animation.roomPreloadHideAnimation(this.getArticleId());
                }
            }

            animation.defaultPreloadHideAnimation();

        }

}