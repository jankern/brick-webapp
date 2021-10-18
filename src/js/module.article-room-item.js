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
    default class ArticleRoomItem extends Article {

        constructor(articleId, path, prop){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};
            this.type = 'RoomItem';
            this.zIndex = 10;
        }

        createElememt(){
            let childrenObj = Util.getElementChildren('main');
            let count = childrenObj.count;

            if(childrenObj.count > 0){
                count = childrenObj.count-2;
            }

            this.articleElement = document.createElement('div');
            this.articleElement.id = 'article-'+this.articleId;
            this.articleElement.className = "view-wrapper page rooms";
            this.articleElement.style.zIndex = this.zIndex + count;
            let bgColor = this.prop.backgroundColor ? this.prop.backgroundColor : Util.getRandomColor();
            this.articleElement.style.backgroundColor = bgColor;
            this.zIndex = this.zIndex + count;
            
            mainElement = document.querySelector('main');
            mainElement.appendChild(this.articleElement);
            this.updateState();
            console.log(history);

            this.nextBtn = document.createElement('a');
            this.nextBtn.id = 'gallery-next-'+this.articleId;
            this.nextBtn.className = 'material-icons navigate_next gallery-next';
            this.nextBtn.href = '#';
            this.nextBtn.innerHTML = 'navigate_next';

            this.previousBtn = document.createElement('a');
            this.previousBtn.id = 'gallery-previous-'+this.articleId;
            this.previousBtn.className = 'material-icons navigate_before gallery-previous';
            this.previousBtn.href = '#';
            this.previousBtn.innerHTML = 'navigate_before';

            this.articleElement.appendChild(this.nextBtn);
            this.articleElement.appendChild(this.previousBtn);

            progressElement = document.querySelector('.view-wrapper.preload');

        }

        updateElement(content){

            // generate html content for the room item list
            let tplHead = !content['name']? '' : '<h1>'+content['name']+'</h1>';
            let tplText = !content['text']? '' : '<p>'+content['text']+'</p>';
            let tplTextContainer = '<div class="item-info">'+tplHead+tplText+'</div>';
            let tplItems = '<div class="item-list">';
            if(content.items.length > 0){
                content.items.forEach(element => {
                    let nav = Article.getArticleRefById(navigation, element.article_id)
                    tplItems += '<div class="item"><img src="'+element.img.toString()+
                        '" style="width:100%" title="'+element.name+'"></div>';
                });
            }
            tplItems += '</div>';

            // add the list to the DOM
            let contentElement = document.createElement('div');
            contentElement.className = 'content';
            contentElement.innerHTML = tplTextContainer+tplItems;
            this.articleElement.appendChild(contentElement);
            
            // create the previous / next nav buttons and hide/show if a next room is clickable
            let next = Article.getNextSubArtRefById(navigation, '', 5, content.article_id); // 3=room, 5=roomitems´
            this.nextBtn.style.visibility = "hidden";
            this.previousBtn.style.visibility = "hidden";
            if(next){
                this.nextBtn.href = next.path;
                this.nextBtn.style.visibility = "visible";
            }
            let previous = Article.getPreviousSubArtRefById(navigation, '', 5, content.article_id); // 3=room, 5=roomitems´
            if(previous){
                this.previousBtn.href = previous.path;
                this.previousBtn.style.visibility = "visible";
            }
        }

        doTransition(){
            progressElement.style.display = 'block';
            progressElement.style.height = '100vh';
            mainElement.appendChild(progressElement);
            animation.preloadDisplayAnimation();
        }

        finishTransition(previousArticle){
            if(previousArticle){
                let previousArticleElement = document.querySelector('#article-'+previousArticle.articleId);
                previousArticleElement.prepend(progressElement);
                animation.preloadHideAnimation(previousArticle.articleId, this);
            }

            // TODO temporary solution, add some animation here!
            else{
                progressElement.style.display = "none";
            }
        }

}