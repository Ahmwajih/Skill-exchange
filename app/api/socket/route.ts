import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

let io: any;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!res.socket.server.io) {
        io = new Server(res.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
            },
        });

        io.on("connection", (socket) => {
            console.log("A user connected: ", socket.id);

            socket.on("send_message", (message) => {
                console.log("Message received: ", message);
                io.emit("receive_message", message); 
            });

            socket.on("disconnect", () => {
                console.log("User disconnected: ", socket.id);
            });
        });

        res.socket.server.io = io;
    }

    res.end();
}
