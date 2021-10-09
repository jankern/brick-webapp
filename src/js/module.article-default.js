/**
 * Class Article
 * 
 */

 import Util from './module.util';
 
 import Animation from './module.animation';
 let animation = new Animation();

 import Article from './module.article';

 let articleElement, progressElement, mainElement;

 export 
    default class ArticleDefault extends Article {

        constructor(articleId, path, prop={}){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};

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
            this.articleElement.className = "view-wrapper page";
            this.articleElement.style.zIndex = this.zIndex + count;
            let bgColor = this.prop.backgroundColor ? this.prop.backgroundColor : Util.getRandomColor();
            this.articleElement.style.backgroundColor = bgColor;
            this.zIndex = this.zIndex + count;
            
            mainElement = document.querySelector('main');
            mainElement.appendChild(this.articleElement);
            this.updateState();

            progressElement = document.querySelector('.view-wrapper.preload');
        }

        updateElement(content){
            this.articleElement.innerHTML = '<div class="content">'+content+'</div>';
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