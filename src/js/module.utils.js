/*
 *  Class Utils
 */

export
    default class Utils {

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

}
