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

}
