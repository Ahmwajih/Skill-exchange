'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/lib/features/chat/chatSlice';

const ChatMessages = ({ conversation, socket, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (conversation) setMessages(conversation.messages || []);
  }, [conversation]);

  const handleSendMessage = () => {
    const message = {
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
    };
    socket.emit('send_message', { ...message, room: conversation._id });
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col flex-1 bg-white">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-2 rounded-lg ${
              msg.senderId === user.id ? 'bg-blue self-end' : 'bg-gray'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center p-4 border-t border-gray">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 mr-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 text-white bg-blue rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;

