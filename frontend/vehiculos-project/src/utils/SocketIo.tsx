import io from 'socket.io-client';

const socket = io('https://18.190.64.227/vehiculo/loc', {
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "https://prueba-tecnica-khaki.vercel.app", 
    
    
  },
});

export default socket;
