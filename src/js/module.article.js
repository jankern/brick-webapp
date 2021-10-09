/**
 * Interface Article
 * 
 */

 import Util from './module.util';
 let articleElement, progressElement, mainElement;

 export 
    default class Article {

        constructor(articleId, path, prop={}){

            this.articleId = articleId;
            this.path = path;
            this.prop = prop;
            this.articleElement = {};

            this.zIndex = 10;
        }

        updateState(){
            let randId = Util.generateRandomNumber(7);
            history.pushState(
                {path: this.path, articleId: this.articleId, state:randId}, 
                this.title,
                this.path
            );
        }

        replaceState(){
            history.replaceState(
                {path: this.path, articleId: this.articleId}, 
                this.title,
                this.path
            );
        }

        getArticleId(){
            return this.articleId;
        }

        getArticlePath(){
            return this.path;
        }

        getZIndex(){
            return this.zIndex;
        }

        setZIndex(zIndex){
            this.zIndex = zIndex;
            this.articleElement.style.zIndex = this.zIndex;
        }

}