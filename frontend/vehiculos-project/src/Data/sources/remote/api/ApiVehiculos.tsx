import axios from 'axios';


const ApiVehiculos = axios.create({
    baseURL: 'http://192.168.100.110/api',
    headers: {
        'Content-type': 'application/json'
    }
});


export{ApiVehiculos};
