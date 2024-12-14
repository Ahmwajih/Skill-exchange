import Pusher from 'pusher-js';

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: `${BASE_URL}/api/send-message`, 
});

export default pusher;
