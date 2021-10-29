/**
 * Class Util
 * 
 */

export
    default class Util {

    static getViewPortMaxAxis(){

        let width = window.innerWidth;
        let height = window.innerHeight;

        if(width > height){
            return width;
        }

        return height;

    }
    
    static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static getObjectLength(obj){
        let itemCount = 0;
        for(let i in obj){
            if (obj.hasOwnProperty(i)) {
                ++itemCount;
            }
        }
        return itemCount;
    }

    static getPositionOfElement(el) {
        var xPos = 0;
        var yPos = 0;
       
        while (el) {
          if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;
       
            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
          } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
          }
       
          el = el.offsetParent;
        }
        return {
          x: xPos,
          y: yPos
        };
    }

    static extractPath(path) {
        // extracts last ndoe from a given path
        // /sub/path -> path
        let extractedStringPosition = path.search(/[^\/]+(?=\/$|$)/);
        return path.substr(extractedStringPosition, path.length);
    }

    static getElementsByTagAndClass(htmlTag, cssClass){

        if (!htmlTag) return 0;

        let filteredChildren = [];
        let children = document.querySelectorAll(htmlTag);

        if(children.length > 0){
            for(let i = 0; i < children.length; i++){
                if(cssClass){
                    let regexp = new RegExp(cssClass);
                    let hasClass = children[i].className.search(regexp);
                    if(hasClass > 0){
                        filteredChildren.push(children[i]);
                    }
                }else{
                    filteredChildren.push(children[i]);
                }
            }
        }else{
            return 0;
        }

        return filteredChildren;

    }

    static getElementChildren(el){

        let pageWrapper = document.querySelector(el);
        let children = pageWrapper.childNodes;

        let pageLayer = [];
        let elCount = 0;
        
        for( let i in children){
            if(children.hasOwnProperty(i)){
                if(children[i].nodeName === "DIV"){
                    let hasClass = children[i].className.search(/page/);
                    if(hasClass > 0){
                        pageLayer.push(children[i]);
                        elCount += 1;
                    }
                }
                
            }
        }

        return {children: pageLayer, count: elCount};

    }

    static getBaseUrl(){

        let base = document.querySelector('base');
        let baseAttribute = base.getAttribute('href');
        if (baseAttribute.slice(-1) !== "/"){
            baseAttribute = baseAttribute+"/";
        }
        return baseAttribute;

    }

    static replaceBaseUrl(baseUrl, path){

        let startPos = path.search(baseUrl);
        if(startPos != -1){
            return path.substr(baseUrl.length-1, path.length);
        }
        return path;

    }

    static generateRandomNumber(length){

        let num = '';
        if(!length){
            length = 1;
        }
        for(let i = 0; i < length; i++){
            num += Math.floor(Math.random() * (0 + 9));
        }
        return parseInt(num);

    }

}
