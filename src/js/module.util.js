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

    static extractPath(path) {
        // extracts last ndoe from a given path
        // /sub/path -> path
        let extractedStringPosition = path.search(/[^\/]+(?=\/$|$)/);
        return path.substr(extractedStringPosition, path.length);
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
