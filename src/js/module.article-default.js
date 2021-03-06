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
    default class ArticleDefault extends Article {

        constructor(articleId, path, prop){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};
            this.type = 'default';
            //this.zIndex = 10;
        }

        createElememt(){

            let count = Util.getElementsByTagAndClass('div', 'page').length;

            this.articleElement = document.createElement('div');
            this.articleElement.id = 'article-'+this.articleId;
            this.articleElement.className = "view-wrapper page default";
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
            this.articleElement.innerHTML = '<div class="content">'+content.text+'</div>';
        }

        doTransition(){
            progressElement.style.display = 'block';
            progressElement.style.height = '100vh';
            mainElement.appendChild(progressElement);
            animation.defaultPreloadDisplayAnimation();
        }

        finishTransition(previousArticle){

            animation.defaultPreloadHideAnimation();

            // if(previousArticle){
            //     let previousArticleElement = document.querySelector('#article-'+previousArticle.articleId);
            //     console.log(previousArticleElement)
            //     previousArticleElement.prepend(progressElement);
            //     animation.preloadHideAnimation(previousArticle.articleId, this);
            // }

            // // TODO temporary solution, add some animation here!
            // else{
            //     //progressElement.style.display = "none";
            //     this.articleElement.prepend(progressElement);
            //     animation.preloadHideAnimation('', this);
            // }
        }

}