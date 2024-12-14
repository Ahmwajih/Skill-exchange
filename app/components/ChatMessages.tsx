import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/lib/features/chat/chatSlice';
import Pusher from 'pusher-js';
import dayjs from 'dayjs';

const ChatMessages = ({ conversation, user }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || []);
    }
  }, [conversation]);

  useEffect(() => {
    const pusher = new Pusher('b85eae341f11d9507db7', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe(`conversation-${conversation?._id}`);
    channel.bind('receive_message', (message) => {
      dispatch(addMessage({ conversationId: conversation?._id, message }));
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversation?._id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = {
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
    };
    fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...message, conversationId: conversation?._id }),
    });
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (date) => {
    const now = dayjs();
    const messageDate = dayjs(date);
    if (now.isSame(messageDate, 'day')) {
      return `Today at ${messageDate.format('HH:mm')}`;
    }
    return messageDate.format('DD/MM/YYYY HH:mm');
  };

  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-2 max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${
              msg.senderId === user.id ? 'bg-blue text-white ml-auto' : 'bg-light-blue text-black mr-auto'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray mt-1">{formatDate(msg.timestamp)}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-4 border-t border-gray-300">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 mr-2 bg-white border rounded-lg focus:outline-none focus:ring focus:ring-blue"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 text-white bg-blue rounded-lg hover:bg-blue"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;