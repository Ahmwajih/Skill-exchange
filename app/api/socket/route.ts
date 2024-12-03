import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "@/lib/chat/chatSlice"; // Adjust import based on your structure
import { io } from "socket.io-client";


const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const socket = io(BASE_URL + "/api/socket");

const ChatComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("deal_accepted", ({ providerEmail, providerName }) => {
      // Handle deal acceptance notification
      console.log(`${providerName} has accepted your deal.`);
      // You can also notify users or update UI accordingly
    });

    return () => {
      socket.off("receive_message");
      socket.off("deal_accepted");
    };
  }, [dispatch]);

  return (
    <div>
      {/* Render chat messages here */}
    </div>
  );
};