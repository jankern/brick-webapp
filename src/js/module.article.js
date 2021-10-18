/**
 * Interface Article
 * 
 */

 import Util from './module.util';
 import {navigation} from './module.navigation';
 let articleElement, progressElement, mainElement;
 let articleNavRefById, articleNavRefByPath, nextSubArtRefById, previousSubArtRefById, nextLimit, previousObj;

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
            console.log('UDPATESTATE');
            console.log(history);
        }

        replaceState(){
            history.replaceState(
                {path: this.path, articleId: this.articleId}, 
                this.title,
                this.path
            );
            console.log('REPLACEESTATE');
            console.log(history);
        }

        // Extract the article nav reference based on a given path with a recursive method
        // Param: sideNavObject, Article id of the nav ref to be returned
        static getArticleRefByPath(obj, path){

            // remove ending / 
            if(path.substr(path.length-1) === '/'){
                path = path.substr(0, path.length-1);
            } 

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

        // Returns a possible NEXT nav reference by a given article id AND nav depth
        // 3= sublevel (room), 5 = sub sub level (toomitem)
        static getNextSubArtRefById(obj, stack, depth, id){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    
                    let arr = [];
                    if(stack !== ''){
                        arr = stack.split('.');
                    }

                    if(arr.length === depth){
                        //console.log(stack + ' - ' +id+ ' : '+key);
                        if(nextLimit === 1){
                            nextLimit = 0;
                           // console.log({"article_id":key, "path":obj[key].path, "article_type": obj[key].article_type});
                            let nav = {};
                            nav['article_id'] = key;
                            nav['path'] = obj[key].path;
                            if(obj[key].article_type) nav['article_type'] = obj[key].article_type;
                            return nav;
                        }
                        if(key === id){
                            nextLimit = 1;
                        }
                    }

                    nextSubArtRefById = Article.getNextSubArtRefById(obj[key], stack+'.'+key, depth, id);
                  }
                }
            }
            let tmp = nextSubArtRefById;
            nextSubArtRefById = undefined;
            return tmp;
        }

        // Returns a possible PREVIOUS nav reference by a given article id AND nav depth
        // 3= sublevel (room), 5 = sub sub level (toomitem)
        static getPreviousSubArtRefById(obj, stack, depth, id){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    
                    let arr = [];
                    if(stack !== ''){
                        arr = stack.split('.');
                    }

                    if(arr.length === depth){
                        //console.log(stack + ' - ' +id+ ' : '+key);
                        if(key === id){
                            let tmp = previousObj;
                            previousObj = undefined;
                            return tmp;
                        }
                        // temporary store the item
                        previousObj = {"article_id":key, "path":obj[key].path};
                        if(obj[key].article_type) previousObj['article_type'] = obj[key].article_type;
                    }

                    previousSubArtRefById = Article.getPreviousSubArtRefById(obj[key], stack+'.'+key, depth, id);
                  }
                }
             }
            return previousSubArtRefById;
        }

        getArticleId(){
            return this.articleId;
        }

        setArticlePropertiesAfterRemoteIdCall(id){
            this.articleId = id;
            this.articleElement.id = 'article-'+id;
            this.replaceState();
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