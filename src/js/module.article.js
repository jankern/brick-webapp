/**
 * Class Article
 * 
 */

 import Util from './module.util';
 let util = new Util();

 import Animation from './module.animation';
 let animation = new Animation();

 let articleElement, progressElement, mainElement;

 export 
    default class Article {

        constructor(articleId, path, title=""){

            this.articleId = articleId;
            this.path = path;
            this.title = title;
            this.articleElement = {};

            this.zIndex = 10;
        }

        createElememt(){
            let childrenObj = util.getElementChildren('main');
            let count = childrenObj.count;

            if(childrenObj.count > 0){
                count = childrenObj.count-2;
            }

            this.articleElement = document.createElement('div');
            this.articleElement.id = 'article-'+this.articleId;
            this.articleElement.className = "view-wrapper page";
            this.articleElement.style.zIndex = this.zIndex + count;
            this.articleElement.style.backgroundColor = util.getRandomColor();
            this.zIndex = this.zIndex + count;
            
            mainElement = document.querySelector('main');
            mainElement.appendChild(this.articleElement);
            this.updateState();

            progressElement = document.querySelector('.view-wrapper.preload');
        }

        updateElement(content){
            this.articleElement.innerHTML = '<div class="content">'+content+'</div>';
        }

        updateState(){
            history.pushState(
                {view: util.extractPath(this.path), path: this.path, articleId: this.articleId}, 
                this.title, 
                this.path
            );
        }

        getArticleId(){
            return this.articleId;
        }

        getZIndex(){
            return this.zIndex;
        }

        setZIndex(zIndex){
            this.zIndex = zIndex;
            this.articleElement.style.zIndex = this.zIndex;
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