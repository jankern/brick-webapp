/**
 * Class Article
 * 
 */

 import Util from './module.util';
 // Singleton import
 import {animation} from './module.animation';

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

            progressElement = document.querySelector('.view-wrapper.preload');

        }

        updateElement(content){
            console.log(content);

            // alle acht bilder anzeigen mit
            // links auf den bildern zu den Brickzielen
            // vor und zurück zum nächsten room
            // Anzahl und links zu rooms ins grundätzlich im Menu hinterlegt


            this.articleElement.innerHTML = '<div class="content">'
                +'<a href="/rooms/room2" data-article-id="5">NEXT</a>'
                +'<a href="/rooms/room2/brick1" data-category-id="9" data-article-type="roomItem">To Brick</a>'
                +content+'</div>';
        }

        // updateState(){
        //     let randId = util.generateRandomNumber(7);
        //     history.pushState(
        //         {path: this.path, articleId: this.articleId, state:randId}, 
        //         this.title,
        //         this.path
        //     );
        // }

        // replaceState(){
        //     history.replaceState(
        //         {path: this.path, articleId: this.articleId}, 
        //         this.title,
        //         this.path
        //     );
        // }

        // getArticleId(){
        //     return this.articleId;
        // }

        // getArticlePath(){
        //     return this.path;
        // }

        // getZIndex(){
        //     return this.zIndex;
        // }

        // setZIndex(zIndex){
        //     this.zIndex = zIndex;
        //     this.articleElement.style.zIndex = this.zIndex;
        // }

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