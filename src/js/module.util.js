/**
 * Class Util
 * 
 */

export
    default class Util {

    constructor() {

    }

    getViewPortMaxAxis(){

        let width = window.innerWidth;
        let height = window.innerHeight;

        if(width > height){
            return width;
        }

        return height;

    }
    
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getObjectLength(obj){
        let itemCount = 0;
        for(let i in obj){
            if (obj.hasOwnProperty(i)) {
                ++itemCount;
            }
        }
        return itemCount;
    }

    extractPath(path) {
        // extracts last ndoe from a given path
        // /sub/path -> path
        let extractedStringPosition = path.search(/[^\/]+(?=\/$|$)/);
        return path.substr(extractedStringPosition, path.length);
    }

    getElementChildren(el){

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

}
