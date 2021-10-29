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
            this.zIndex = 10;
        }

        createElememt(){

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

                    // Container position 
                    // we've got the insertPosition
                    // we know the items count 

                    //let totalCount = existingRoomArticles.length;
                    let screenUnit = window.innerWidth;
                    let positionX = insertPosition - screenUnit;
                    roomsContainerElement.style.left = 0+'px';
                }
            }

            // Use status object to determine next article to insert current before
            // or just append
            if(status['mode'] === "appendChild" || !status['mode']){
                roomsContainerElement.appendChild(this.articleElement);
            }else if(status['mode'] === "insertBefore"){
                let existingArticleElement = document.querySelector('#article-'+status['nextId']);
                console.log(existingArticleElement)
                roomsContainerElement.insertBefore(this.articleElement, existingArticleElement);
            }
            
            this.nextBtn = document.createElement('a');
            //.id = 'gallery-next-'+this.articleId;
            this.nextBtn.className = 'material-icons navigate_next gallery-next';
            this.nextBtn.href = '#';
            this.nextBtn.innerHTML = 'navigate_next';
            //this.nextBtn.addEventListener('click', this.nextSlide, false);

            this.previousBtn = document.createElement('a');
            //this.previousBtn.id = 'gallery-previous-'+this.articleId;
            this.previousBtn.className = 'material-icons navigate_before gallery-previous';
            this.previousBtn.href = '#';
            this.previousBtn.innerHTML = 'navigate_before';
            //this.previousBtn.addEventListener('click', this.previousSlide, false);

            this.articleElement.appendChild(this.nextBtn);
            this.articleElement.appendChild(this.previousBtn);

            progressElement = document.querySelector('.view-wrapper.preload');

        }

        // Next click
        nextSlide(event){
            console.log('SLIDELEFT')
            // animation.slideRoomAnimation('next');
        }

        // Previous click
        previousSlide(event){
            console.log('SLIDERIGHT')

        }

        updateElement(content){
        
            // generate html content for the room item list
            let tplItems = '<div>'+content.text+'</div><div class="room-item-list">';
            if(content.items.length > 0){
                content.items.forEach(element => {
                    let nav = Article.getArticleRefById(navigation, element.article_id)
                    tplItems += '<div class="room-item"><a href="'+nav.path+'" data-article-id="'+nav.article_id+
                        '" data-article-type="roomitem">'+'<img src="'+element.img.toString()+
                        '" width="50" title="'+element.name+'">'+element.name+'</a></div>';
                });
            }
            tplItems += '</div>';

            // add the list to the DOM
            let contentElement = document.createElement('div');
            contentElement.className = 'content';
            contentElement.innerHTML = tplItems;
            this.articleElement.appendChild(contentElement);
            
            // create the previous / next nav buttons and hide/show if a next room is clickable
            //Article.nextLimit = 0;
            let next = Article.getNextSubArtRefById(navigation, '', 3, content.article_id); // 3=room, 5=roomitems´
            //console.log('NEXT');console.log(next);
            this.nextBtn.style.visibility = "hidden";
            this.previousBtn.style.visibility = "hidden";
            if(next){
                this.nextBtn.href = next.path;
                this.nextBtn.style.visibility = "visible";
            }
            let previous = Article.getPreviousSubArtRefById(navigation, '', 3, content.article_id); // 3=room, 5=roomitems´
            //console.log('PREV');console.log(previous);
            if(previous){
                this.previousBtn.href = previous.path;
                this.previousBtn.style.visibility = "visible";
            }

            this.updateState();
        }

        doTransition(){
            // progressElement.style.display = 'block';
            // progressElement.style.height = '100vh';
            // mainElement.appendChild(progressElement);
            // animation.preloadDisplayAnimation();
        }

        reattachTransitionElement(){
            // mainElement.appendChild(progressElement);
            // console.log('progress element attached ');
            // console.log(progressElement);
        }

        finishTransition(previousArticle){

            // animation.preloadHideAnimation2();

            // if(previousArticle){
            //     let previousArticleElement = document.querySelector('#article-'+previousArticle.articleId);
            //     console.log(previousArticleElement)
            //     previousArticleElement.prepend(progressElement);
            //     animation.preloadHideAnimation(previousArticle.articleId, this);
            // }

            // // TODO temporary solution, add some animation here!
            // else{
            //     //progressElement.style.display = "none";
            //     this.articleElement.prepend(progressElement);
            //     animation.preloadHideAnimation('', this);
            // }
        }

}