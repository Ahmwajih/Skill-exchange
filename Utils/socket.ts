import Pusher from 'pusher-js';

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const pusher = new Pusher('b85eae341f11d9507db7', {
  cluster: 'eu',
  authEndpoint: `${BASE_URL}/api/send-message`, 
});

export default pusher;
