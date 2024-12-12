
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addMessage } from '@/lib/features/chat/chatSlice'; 


const ChatMessages = ({ conversation, socket, user }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.conversations.data.find(conv => conv._id === conversation._id)?.messages || []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        dispatch(addMessage({ conversationId: conversation._id, message }));
      });
    }
  }, [socket, dispatch, conversation._id]);

  const handleSendMessage = () => {
    const message = {
      senderId: user._id,
      content: newMessage,
      timestamp: new Date(),
    };
    socket.emit('send_message', { ...message, room: conversation._id });
    dispatch(addMessage({ conversationId: conversation._id, message }));
    setNewMessage('');
  };

  return (
    <div className="chat-messages">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <strong>{msg.senderId}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      <style jsx>{`
        .chat-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        .message {
          margin-bottom: 10px;
        }
        .message-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ccc;
        }
        .message-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .message-input button {
          margin-left: 10px;
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChatMessages;