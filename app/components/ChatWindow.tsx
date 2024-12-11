import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, acceptDeal } from "@/lib/features/chat/chatSlice";
import Message from "./Message";
import socket from "@/Utils/socket";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("deal_accepted", ({ providerEmail, providerName, seekerEmail, seekerName }) => {
      dispatch(acceptDeal({ providerEmail, providerName }));
      console.log(`${providerName} has accepted your deal.`);
    });

    return () => {
      socket.off("receive_message");
      socket.off("deal_accepted");
    };
  }, [dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("send_message", { text: newMessage, sender: 'me' });
      dispatch(addMessage({ text: newMessage, sender: 'me' }));
      setNewMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <style jsx>{`
        .chat-window {
          display: flex;
          flex-direction: column;
          height: 400px; /* Adjust height as needed */
          border: 1px solid #ccc;
          border-radius: 10px;
          overflow-y: auto;
        }
        .messages {
          flex-grow: 1;
          padding: 10px;
          overflow-y: auto;
        }
        .input-area {
          display: flex;
        }
        input {
          flex-grow: 1;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }
        button {
          padding: 10px;
          margin-left: 5px;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;