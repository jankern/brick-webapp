/**
 * Class Article
 * 
 */

 import Util from './module.util';
 // Singleton import
 import {animation} from './module.animation';
 import {navigation} from './module.navigation';

 import Article from './module.article';
 import {articles} from './module.articles';

 let articleElement, progressElement, mainElement;

 export 
    default class ArticleRoomItem extends Article {

        constructor(articleId, path, prop){

            super(articleId, path, prop, articleElement);
            // this.articleId = articleId;
            // this.path = path;
            // this.prop = prop;
            // this.articleElement = {};
            this.type = 'roomitem';
            this.parentArticle;
            //this.zIndex = 10;
        }

        createElememt(){

            // get parent propteries
            console.log(navigation);
            console.log(this.articleId);
            console.log(this.prop.article_id)
            this.parentArticle = Article.getArticleParentRefById(navigation, '', this.prop.article_id);
            console.log(this.parentArticle);
            this.backgroundColor = this.parentArticle.backgroundColor;
            
            let count = Util.getElementsByTagAndClass('div', 'page').length;

            this.articleElement = document.createElement('div');
            this.articleElement.id = 'article-'+this.articleId;
            this.articleElement.className = "view-wrapper page roomitem";
            this.articleElement.style.zIndex = this.zIndex + count;
            let bgColor = this.backgroundColor ? this.backgroundColor : Util.getRandomColor();
            this.articleElement.style.backgroundColor = bgColor;
            this.zIndex = this.zIndex + count;
            
            mainElement = document.querySelector('main');
            mainElement.appendChild(this.articleElement);
            this.updateState();

            this.nextBtn = document.createElement('a');
            this.nextBtn.className = 'material-icons gallery_navigate gallery-next';
            this.nextBtn.href = '#';
            this.nextBtn.innerHTML = 'navigate_next';
            //this.nextBtn.addEventListener('click', this.nextSlide, false);

            this.previousBtn = document.createElement('a');
            //this.previousBtn.id = 'gallery-previous-'+this.articleId;
            this.previousBtn.className = 'material-icons gallery_navigate gallery-previous';
            this.previousBtn.href = '#';
            this.previousBtn.innerHTML = 'navigate_before';
            //this.previousBtn.addEventListener('click', this.previousSlide, false);

            this.articleElement.appendChild(this.nextBtn);
            this.articleElement.appendChild(this.previousBtn);

            progressElement = document.querySelector('.view-wrapper.preload');



        }

        updateElement(content){

            // generate html content for the room item list
            let tplHead = !content['name']? '' : '<h1 style="background-color:'+this.backgroundColor+'">'+content['name']+'</h1>';
            let tplText = !content['text']? '' : '<p style="background-color:'+this.backgroundColor+'">'+content['text']+'</p>';
            let tplSpecs = !content['specs']? '' : '<p style="background-color:'+this.backgroundColor+'">'+content['specs']+'</p>';
            let tplHeadImage = !content['img']? '' : content['img'];

            let tplItems = "";
            if(content.items.length > 0){
                let i = 0;
                content.items.forEach(element => {
                    //let nav = Article.getArticleRefById(navigation, element.article_id)
                    if(i < 1){
                        tplItems += '<div class="item-slice title"><div class="col col-3-3" '+
                        'style="background-image:url(\''+tplHeadImage.toString()+'\')"><div class="tpl tpl-header">'+tplHead+'</div><div class="tpl tpl-text">'+tplText+'</div></div></div>';
                    }else if(i == 1){
                        tplItems += '<div class="item-slice"><div class="col col-3-2"><img src="'+element.img.toString()+
                            '" title="'+element.name+'"></div>'+
                            '<div class="col col-3-1 text"><div class="tpl tpl-text">'+tplSpecs+'</div><div class="tpl tpl-text"><p style="background-color:'+this.backgroundColor+'">'+element.name+'</p></div></div></div>';
                    }else{
                        tplItems += '<div class="item-slice"><div class="col col-3-2"><img src="'+element.img.toString()+
                            '" title="'+element.name+'"></div>'+
                            '<div class="col col-3-1 text"><div class="tpl tpl-text"><p style="background-color:'+this.backgroundColor+'">'+element.name+'</p></div></div></div>';
                    }
                    i += 1;
                });
            }

            let scrollableElement1 = document.createElement('div');
            scrollableElement1.className = 'scrollable-element-1';
            scrollableElement1.style.top = (window.innerHeight - 100) +'px';
            scrollableElement1.style.backgroundColor = this.parentArticle.backgroundColor;
            this.articleElement.appendChild(scrollableElement1);

            let scrollableElement2 = document.createElement('div');
            scrollableElement2.className = 'scrollable-element-2';
            scrollableElement2.style.backgroundColor = this.parentArticle.backgroundColor;
            this.articleElement.appendChild(scrollableElement2);

            let scrollableElement3 = document.createElement('div');
            scrollableElement3.className = 'scrollable-element-3';
            scrollableElement3.style.backgroundColor = this.parentArticle.backgroundColor;
            this.articleElement.appendChild(scrollableElement3);

            let scrollableElement4 = document.createElement('div');
            scrollableElement4.className = 'scrollable-element-4';
            scrollableElement4.style.backgroundColor = 'white';
            this.articleElement.appendChild(scrollableElement4);

            // add the list to the DOM
            let contentElement = document.createElement('div');
            contentElement.className = 'content';
            //contentElement.innerHTML = tplTextContainer+tplItems;
            contentElement.innerHTML = tplItems;
            this.articleElement.appendChild(contentElement);

            animation.blendInItemTitle(this.articleId);
            animation.scrollBackgroundElementsForRoomItemsList(this.articleId);
            
            // create the previous / next nav buttons and hide/show if a next room is clickable
            //Article.nextLimit = 0;
            let next = Article.getNextSubArtRefById(navigation, '', 5, content.article_id); // 3=room, 5=roomitems´
            if(next){
                this.nextBtn.href = next.path;
                let cl = this.nextBtn.className;
                this.nextBtn.className = cl+' add-opacity';
            }
            let previous = Article.getPreviousSubArtRefById(navigation, '', 5, content.article_id); // 3=room, 5=roomitems´
            if(previous){
                this.previousBtn.href = previous.path;
                let cl = this.previousBtn.className;
                this.previousBtn.className = cl+' add-opacity';
            }
        }

        doTransition(){

            console.log(this.prop.previousArticleType);

            if(this.prop.previousArticleType === 'room'){
                document.body.appendChild(progressElement);
                animation.roomItemPreloadDisplayAnimation();

            }else{
                progressElement.style.display = 'block';
                progressElement.style.height = '100vh';
                mainElement.appendChild(progressElement);
                animation.defaultPreloadDisplayAnimation();
            }
            
            
        }

        finishTransition(previousArticle){

            if(this.prop.previousArticleType === 'room'){
                let roomItemTransition = document.querySelector('.room-item-transition');
                roomItemTransition.style.display = 'none';
            }

            animation.defaultPreloadHideAnimation();

            

            // if(previousArticle){
            //     let previousArticleElement = document.querySelector('#article-'+previousArticle.articleId);
            //     previousArticleElement.prepend(progressElement);
            //     animation.preloadHideAnimation(previousArticle.articleId, this);
            // }

            // // TODO temporary solution, add some animation here!
            // else{
            //     progressElement.style.display = "none";
            // }
        }

}