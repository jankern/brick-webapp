
import Utils from './module.utils';
let utils = new Utils();

export
    default class HttpService {

    constructor() {

    }

    requestChaining(){

        return {
            call: (callback, obj, recall=false) => {
                let p  = new Promise(
                    (resolve, reject) => {
                        return callback(resolve, reject, obj, recall);
                    }
                );
                return p;
            }
        }
    }

    get(resolve, reject, targetObj, recall) {

        //Obj of data for POST/PUT
        //const data = { username: 'example' };

        let preparedParams = '';
        let objLength = utils.getObjectLength(targetObj);

        if((targetObj.article_id !== undefined && targetObj.article_id !== "") && !targetObj.get_aid_by_nav && !recall){
            console.log('abbrechen');
            return resolve('skip_nav_retrieval');
        }

        let count = 0;
        for(let i in targetObj){
            if (targetObj.hasOwnProperty(i)) {
                if(count >= 1 && objLength > 1){
                    preparedParams += '&'+i+'='+targetObj[i];
                }else{
                    preparedParams += i+'='+targetObj[i];
                }
                ++count;
            }
        }

        return fetch('http://localhost:8000/server.php?'+preparedParams, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify(data),
        })
            .then((response) => response.json())
            //Then with the data from the response in JSON...
            .then((data) => {
                // console.log('IN FETCH');
                // console.log(data);
                return resolve(data);
            })
            //Then with the error generated...
            .catch((error) => {
                //console.error('Error:', error);
                return reject(error);
            });

    }

}