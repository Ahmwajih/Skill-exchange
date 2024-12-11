import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/lib/features/chat/chatSlice";
import socket from "@/Utils/socket";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [newMessage, setNewMessage] = useState(""); // Define newMessage state

  useEffect(() => {
    socket.on("receive_message", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [dispatch]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { text: newMessage, room: "someRoomIdentifier", senderId: user._id }; // Use appropriate room identifier and sender ID
      socket.emit("send_message", messageData);
      dispatch(addMessage({ text: newMessage, sender: 'me' }));
      setNewMessage("");
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      
       <div className="input-area">
         <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." />
         <button onClick={handleSendMessage}>Send</button>
       </div>
       
       {/* Add styles for chat window */}
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
