import axios from 'axios';


const ApiVehiculos = axios.create({
    baseURL: 'http://18.190.64.227/api',
    headers: {
        'Content-type': 'application/json'
    }
});


export{ApiVehiculos};
