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

            document.querySelector('body').className = 'body-room-item';

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

            this.nextBtn = document.createElement('div');
            this.nextBtn.className = 'gallery_navigate gallery-next';
            this.nextBtn.innerHTML = '<a href="#" class="material-icons next" style="color:'+this.parentArticle.backgroundColor+'" data-link-type="article">navigate_next</a>'+
                '<div class="tool-tip-title" style="background-color:'+this.parentArticle.backgroundColor+'"></div>';

            this.previousBtn = document.createElement('div');
            this.previousBtn.className = 'gallery_navigate gallery-previous';
            this.previousBtn.innerHTML = '<a href="#" class="material-icons previous" style="color:'+this.parentArticle.backgroundColor+'" data-link-type="article">navigate_before</a>'+
            '<div class="tool-tip-title" style="background-color:'+this.parentArticle.backgroundColor+'"></div>';

            // TODO language based replacement for link name
            this.parentBtn = document.createElement('div');
            this.parentBtn.className = 'gallery_navigate gallery-parent';
            this.parentBtn.innerHTML = '<a href="'+this.parentArticle.path+'" class="material-icons parent" style="color:'+
                this.parentArticle.backgroundColor+'" data-article-id="'+this.parentArticle.article_id+'" data-link-type="article">arrow_drop_up</a>'+
                '<div class="tool-tip-title" style="background-color:'+this.parentArticle.backgroundColor+'">Go up to room \''+this.parentArticle.name+'\'</div>';


            this.articleElement.appendChild(this.nextBtn);
            this.articleElement.appendChild(this.previousBtn);
            this.articleElement.appendChild(this.parentBtn);

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
            // Article.nextLimit = 0;
            // TODO language based replacement for link name
            let next = Article.getNextSubArtRefById(navigation, '', 5, content.article_id); // depth level 3=room, 5=roomitems
            if(next){
                let a = this.nextBtn.firstChild;
                if(a.nodeName === 'A'){
                    a.href = next.path;
                }
                let d = this.nextBtn.lastElementChild;
                if(d.nodeName === 'DIV'){
                    d.innerHTML = "Go to brick '"+next.name+"'";
                }
                let cl = this.nextBtn.className;
                this.nextBtn.className = cl+' add-opacity';
            }
            let previous = Article.getPreviousSubArtRefById(navigation, '', 5, content.article_id); // 3=room, 5=roomitems´
            if(previous){
                let a = this.previousBtn.firstChild;
                if(a.nodeName === 'A'){
                    a.href = previous.path;
                }
                let d = this.previousBtn.lastElementChild;
                if(d.nodeName === 'DIV'){
                    d.innerHTML = "Go to brick '"+previous.name+"'";
                }
                let cl = this.previousBtn.className;
                this.previousBtn.className = cl+' add-opacity';
            }

            let clp = this.parentBtn.className;
            this.parentBtn.className = clp+' add-opacity';

            animation.animateSlideButton(this.getArticleId());
        }

        doTransition(){

            console.log(this.prop);

            if(this.prop.previousArticleType === 'room'){

                document.body.appendChild(progressElement);
                animation.roomItemPreloadDisplayAnimation();

            }else{

                progressElement.style.display = 'block';
                progressElement.style.height = '100vh';

                let direction;

                if(this.prop.current_slider_direction){

                    progressElement.style.width = '0px';

                    if(this.prop.current_slider_direction === 'next'){     
                        progressElement.style.right = '0px';
                        progressElement.style.left = 'unset';
                    }else if(this.prop.current_slider_direction === 'previous'){
                        progressElement.style.left = '0px';
                        progressElement.style.right = 'unset';
                    }
                    direction = this.prop.current_slider_direction;
                }

                mainElement.appendChild(progressElement);
                animation.defaultPreloadDisplayAnimation(direction);
            }
            
            
        }

        finishTransition(previousArticle){

            if(this.prop.previousArticleType === 'room'){
                let roomItemTransition = document.querySelector('.room-item-transition');
                roomItemTransition.style.display = 'none';
            }

            let direction;

            if(this.prop.current_slider_direction){
                if(this.prop.current_slider_direction === 'next'){     
                    progressElement.style.right = 'unset';
                    progressElement.style.left = '0px';
                }else if(this.prop.current_slider_direction === 'previous'){
                    progressElement.style.left = 'unset';
                    progressElement.style.right = '0px';
                }
                direction = this.prop.current_slider_direction;
            }

            animation.defaultPreloadHideAnimation(direction);

        }

}