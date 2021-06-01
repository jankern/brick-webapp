export
    default class HttpService {

    constructor() {

    }

    get() {

        //Obj of data to send in future like a dummyDb
        //const data = { username: 'example' };

        //POST request with body equal on data in JSON format
        return fetch('http://localhost:8080/jo', {
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
                return data;
            })
            //Then with the error genereted...
            .catch((error) => {
                console.error('Error:', error);
                return 'Error:'+ error;
            });

    }

}