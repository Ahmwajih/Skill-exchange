import { io } from "socket.io-client";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const socket = io(BASE_URL, {
    path: "/api/socket", // Ensure this matches your server's socket.io path
});

export default socket;
