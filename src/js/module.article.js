/**
 * Class Article
 * 
 */

 import Util from './module.util';
 let util = new Util();

 import Animation from './module.animation';
 let animation = new Animation();

 let zIndex, articleElement, progressElement, mainElement;

 export 
    default class Article {

        constructor(articleId, path, title=""){

            this.articleId = articleId;
            this.path = path;
            this.title = title;

            zIndex = 10;
        }

        createElememt(){
            let childrenObj = util.getElementChildren('main');
            let count = childrenObj.count;

            if(childrenObj.count > 0){
                count = childrenObj.count-2;
            }

            articleElement = document.createElement('div');
            articleElement.id = 'article-'+this.articleId;
            articleElement.className = "view-wrapper page";
            articleElement.style.zIndex = zIndex + count;
            
            mainElement = document.querySelector('main');
            mainElement.appendChild(articleElement);
            this.updateState();

            progressElement = document.querySelector('.view-wrapper.preload');
        }

        updateElement(content){
            articleElement.innerHTML = content;
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

        setZIndex(parZIndex){
            zIndex = parZIndex;
            console.log(this.articleId);
            console.log(zIndex)
        }

        doTransition(){
            progressElement.style.display = 'block';
            mainElement.prepend(progressElement);
            animation.preloadDisplayAnimation();
        }

        finishTransition(previousArticle, currentArticleId){
            if(previousArticle){
                let previousArticleElement = document.querySelector('#article-'+previousArticle.articleId);
                previousArticleElement.prepend(progressElement);
                animation.preloadHideAnimation(previousArticle.articleId, currentArticleId);
                this.setZIndex(zIndex+1);
            }

            // TODO temporary solution
            else{
                progressElement.style.display = "none";
            }
        }

}