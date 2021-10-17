/**
 * Class Article
 * 
 */

 import Util from './module.util';
 // Singleton import
 import {animation} from './module.animation';
 import {navigation} from './module.navigation';

 import Article from './module.article';

 let articleElement, progressElement, mainElement;

 export 
    default class ArticleRoom extends Article {

        constructor(articleId, path, prop){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};
            this.type = 'Room';
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
            let tplItems = '<div class="room-item-list">';
            if(content.items.length > 0){
                content.items.forEach(element => {
                    let nav = Article.getArticleRefById(navigation, element.article_id)
                    tplItems += '<div class="room-item"><a href="'+nav.path+'" data-article-id="'+nav.article_id+
                        '" data-article-type="roomItem">'+'<img src="'+element.img.toString()+
                        '" width="50" title="'+element.name+'">'+element.name+'</a></div>';
                });
            }
            tplItems += '</div>';

            // add the list to the DOM
            let contentElement = document.createElement('div');
            contentElement.className = 'content';
            contentElement.innerHTML = tplItems;
            this.articleElement.appendChild(contentElement);
            
            // create the previous / next nav
            let next = Article.getNextRoomRefById(navigation, content.article_id);
            this.nextBtn.style.visibility = "hidden";
            this.previousBtn.style.visibility = "hidden";
            if(next){
                this.nextBtn.href = next.path;
                this.nextBtn.style.visibility = "visible";
            }
            let previous = Article.getPreviousRoomRefById(navigation, content.article_id);
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

            // TODO temporary solution
            else{
                progressElement.style.display = "none";
            }
        }

}