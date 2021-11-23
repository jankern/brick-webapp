/**
 * Interface Article
 * 
 */

 import Util from './module.util';
 import {navigation} from './module.navigation';
 let articleElement, progressElement, mainElement;
 let articleNavRefById, articleNavRefByPath, nextSubArtRefById, 
    previousSubArtRefById, nextLimit, previousObj, 
    firstChildOfArticeType, articleParentNavRefById, articleParentPreviousNavRef;

 export 
    default class Article {

        constructor(articleId, path, prop={}){

            this.articleId = articleId;
            this.path = path;
            this.prop = prop;
            this.articleElement = {};
            this.redirectionId;
            this.type;
            this.orderIndex;
            this.zIndex = 0;
            this.display = "flex";
        }

        updateState(){
            let randId = Util.generateRandomNumber(7);
            history.pushState(
                {path: this.path, articleId: this.articleId, state:randId}, 
                this.title,
                this.path
            );
            console.log('UDPATE_STATE');
            console.log(history);
        }

        replaceState(){
            history.replaceState(
                {path: this.path, articleId: this.articleId}, 
                this.title,
                this.path
            );
            console.log('REPLACE_STATE');
            console.log(history);
        }

        static getFirstChildOfArticleType(obj, articleType){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    if(articleType === obj[key]['article_type']){

                        let i = 0;
                        for (let key2 in obj[key]['articles']){
                            if(obj[key]['articles'].hasOwnProperty(key2)){
                                if(i < 1){
                                    let article = obj[key]['articles'][key2];
                                    article.article_id = key2;
                                    return article;
                                }
                                i += 1;
                            }
                        }
                    }

                    firstChildOfArticeType = Article.getFirstChildOfArticleType(obj[key], articleType);
                  }
                }
             }
            return firstChildOfArticeType;
        }
        
        // Extract the article nav reference based on a given path with a recursive method
        // Param: sideNavObject, Article id of the nav ref to be returned
        static getArticleRefByPath(obj, path){

            // remove ending / 
            if(path.substr(path.length-1) === '/' && path.length > 1){
                path = path.substr(0, path.length-1);
            } 

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    if(path === obj[key]['path']){
                        let nav = {};
                        nav['article_id'] = key;
                        // get all properties that are not objects
                        for (let p in obj[key]){
                            if(obj[key].hasOwnProperty(p)){
                                if (typeof obj[key][p] != "object"){
                                    nav[p] = obj[key][p];
                                }
                            }
                        }
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
                        // get all properties that are not objects
                        for (let p in obj[key]){
                            if(obj[key].hasOwnProperty(p)){
                                if (typeof obj[key][p] != "object"){
                                    nav[p] = obj[key][p];
                                }
                            }
                        }
                        return nav;
                    }
                    articleNavRefById = Article.getArticleRefById(obj[key], id);
                  }
                }
             }
            return articleNavRefById;
        }

        // Params: Navigation obj, empty string for 'stack', article id
        // Returns: the parent object properties or undefined if no parent exists
        static getArticleParentRefById(obj, stack, id){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                    if (typeof obj[key] == "object") {

                        let nextStack = stack+'.'+key;
                        
                        let arr = [];
                        if(stack !== ''){
                            arr = stack.split('.');
                        }

                        if(arr[arr.length-1] !== 'articles'){
                            articleParentPreviousNavRef = {};
                            for (let p in obj){
                                if(obj.hasOwnProperty(p)){
                                    if (typeof obj[p] != "object"){
                                        articleParentPreviousNavRef[p] = obj[p];
                                    }
                                }
                            }
                            if(arr[arr.length-1]){
                                articleParentPreviousNavRef.article_id = arr[arr.length-1];
                            }
                            
                        }
                        
                        if(id === key){
                            let nav;
                            if (Object.keys(articleParentPreviousNavRef).length !== 0 && articleParentPreviousNavRef.constructor === Object){
                                nav = articleParentPreviousNavRef;
                            } 
                            articleParentPreviousNavRef = {};
                            return nav;
                        }
                        articleParentNavRefById = Article.getArticleParentRefById(obj[key], nextStack, id);
                    }
                }
             }
            return articleParentNavRefById;
        }


        static getNextNavByDepthLevel(obj, stack, depth, id){
            
            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                    if (typeof obj[key] == "object") {
                        
                        let arr = [];
                        if(stack !== ''){
                            arr = stack.split('.');
                        }

                        if(arr.length === depth){
                            //console.log(stack + ' - ' +id+ ' : '+key+' # '+nextLimit);
                            if(nextLimit === 1){

                                nextLimit = 0;
                                let nav = {};
                                nav['article_id'] = key;
                                for (let p in obj[key]){
                                    if(obj[key].hasOwnProperty(p)){
                                        if (typeof obj[key][p] != "object"){
                                            nav[p] = obj[key][p];
                                        }
                                    }
                                }
                                return nav;
                            }
                            if(key === id){
                                nextLimit = 1;
                                //console.log('nextLimit set to '+nextLimit);
                            }
                        }else

                        nextSubArtRefById = Article.getNextNavByDepthLevel(obj[key], stack+'.'+key, depth, id);
                    }
                }
            }
            let tmp = nextSubArtRefById;
            nextSubArtRefById = undefined;
            return tmp;
        }

        // Returns a possible NEXT nav reference by a given article id AND nav depth
        // 3= sublevel (room), 5 = sub sub level (toomitem)
        static getNextSubArtRefById(obj, stack, depth, id){
            nextLimit = 0;
            return Article.getNextNavByDepthLevel(obj, stack, depth, id);
        }

        static getPreviousNavByDepthLevel(obj, stack, depth, id){

            for (let key in obj){
                if(obj.hasOwnProperty(key)){
                  if (typeof obj[key] == "object") {
                    
                    let arr = [];
                    if(stack !== ''){
                        arr = stack.split('.');
                    }

                    if(arr.length === depth){

                        // console.log(stack + ' - ' +id+ ' : '+key);
                        if(key === id){
                            let tmp = previousObj;
                            previousObj = undefined;
                            return tmp;
                        }
                        
                        // temporary store the item
                        previousObj = {};
                        previousObj['article_id'] = key;
                        for (let p in obj[key]){
                            if(obj[key].hasOwnProperty(p)){
                                if (typeof obj[key][p] != "object"){
                                    previousObj[p] = obj[key][p];
                                }
                            }
                        }
                    }

                    previousSubArtRefById = Article.getPreviousNavByDepthLevel(obj[key], stack+'.'+key, depth, id);
                  }
                }
             }
            return previousSubArtRefById;
        }

        // Returns a possible PREVIOUS nav reference by a given article id AND nav depth
        // 3= sublevel (room), 5 = sub sub level (toomitem)
        static getPreviousSubArtRefById(obj, stack, depth, id){

            previousObj = undefined;
            return Article.getPreviousNavByDepthLevel(obj, stack, depth, id);

        }

        setRedirectionId(id){
            this.redirectionId = id;
            if(this.articleElement){
                let classNames = this.articleElement.className
                this.articleElement.className = classNames + ' redirect';
            }

        }

        getRedirectionId(){
            return this.redirectionId;
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
            let articleNavRef = Article.getArticleRefById(navigation, id);
            this.articleId = articleNavRef.article_id;
            this.path = articleNavRef.path;
            this.articleElement.id = 'article-'+id;
            this.updateState();
        }

        getArticlePath(){
            return this.path;
        }

        getArticleType(){
            return this.type;
        }

        setOrderIndex(orderIndex){
            this.orderIndex = orderIndex;
        }

        getZIndex(){
            return this.zIndex;
        }

        setZIndex(zIndex){
            this.zIndex = zIndex;
            this.articleElement.style.zIndex = this.zIndex;
        }

        setDisplay(display){
            this.display = display;
            this.articleElement.style.display = this.display;
        }

        setBackgroundColor(color){
            this.backgroundColor = color;
            this.backgroundColor.style.backgroundColor = this.backgroundColor;
        }

}