/**
 * Interface Article
 * 
 */

 import Util from './module.util';
 import {navigation} from './module.navigation';
 let articleElement, progressElement, mainElement;
 let articleNavRefById, articleNavRefByPath;

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

        // Extract the article nav reference based on a given path with a recursive method
        // Param: sideNavObject, Article id of the nav ref to be returned
        static getArticleRefByPath(obj, path){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    if(path === obj[key]['path']){
                        let nav = {};
                        nav['article_id'] = key;
                        nav['path'] = obj[key].path;
                        if(obj[key].article_type) nav['article_type'] = obj[key].article_type;
                        return nav;
                    }
                    articleNavRefByPath = Article.getArticleRefByPath(obj[key], path);
                  }
                }
             }
            return articleNavRefByPath;
        }

        // Extract the article nav reference based on a given article id with a recursive method
        // Param: sideNavObject, path of the nav ref to be returned
        static getArticleRefById(obj, id){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    if(id === key){
                        let nav = {};
                        nav['article_id'] = key;
                        nav['path'] = obj[key].path;
                        if(obj[key].article_type) nav['article_type'] = obj[key].article_type;
                        return nav;
                    }
                    articleNavRefById = Article.getArticleRefById(obj[key], id);
                  }
                }
             }
            return articleNavRefById;
        }

        // Return a possible NEXT nav reference by a given article id with fixed depth level loop
        static getNextRoomRefById(obj, id){

            let nextNavRefById;
            let nextLimit = 0;
            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key].path === '/rooms'){
                        for (let key2 in obj[key].articles){
                            if(obj[key].articles.hasOwnProperty(key2)){
                                // If the id matches, get the next article id
                                if(key2 === id){
                                    nextLimit++;
                                }
                                if(key2 !== id && nextLimit === 1){
                                    nextNavRefById = {"article_id":key2, "path":obj[key].articles[key2].path};
                                    break;
                                }
                            }
                        }
                    }
                }
             }
            return nextNavRefById;
        }

        // Return a possible PREVIOUS refernce by a given article id with fixed depth level loop
        static getPreviousRoomRefById(obj, id){

            let previousNavRefById;
            let item;
            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key].path === '/rooms'){
                        for (let key2 in obj[key].articles){
                            if(obj[key].articles.hasOwnProperty(key2)){
                                // If the id matches and there is no previous nav reference, exit
                                // else item is the previous nav reference
                                if(key2 === id){
                                    if(!item){
                                        break;
                                    }else{
                                        previousNavRefById = item;
                                        break;
                                    }
                                }
                                // temporary store the item
                                item = {"article_id":key2, "path":obj[key].articles[key2].path};
                            }
                        }
                    }
                }
             }
            return previousNavRefById;
        }

        getArticleId(){
            return this.articleId;
        }

        setArticlePropertiesAfterRedirect(id){
            console.log(id);
            let articleNavRef = Article.getArticleRefById(navigation, id);
            console.log(articleNavRef);
            this.articleId = articleNavRef.article_id;
            this.path = articleNavRef.path;
            this.updateState();
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