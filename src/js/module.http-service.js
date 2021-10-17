/**
 * Class HTTP service
 * 
 */

import Util from './module.util';

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
        let objLength = Util.getObjectLength(targetObj);

        if((targetObj.article_id !== undefined && targetObj.article_id !== "") && !targetObj.get_aid_by_nav && !recall){
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
        //return fetch(Util.getBaseUrl()+'server.php?'+preparedParams, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow', // => default, manual => handle response yourself
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify(data),
        })
            // Access response headers
            .then(response => {
                    // for (let header of response.headers.entries()) {
                    //     console.log(header);
                    // }
                    return response;
            })
            // Convert response to json
            // .then((response) => response.json()
            .then((response) => response.json().then(res => {
                    return {status: res.status, data: res};
                })
            )

            // Access the reponse body data
            .then((response) => {
                console.log(response);
                return resolve(response.data);
            })

            // catch errors
            .catch((error) => {
                return reject(error);
            });

    }

}