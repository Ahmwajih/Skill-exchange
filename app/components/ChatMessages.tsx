import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/lib/features/chat/chatSlice';
import Pusher from 'pusher-js';

const ChatMessages = ({ conversation, user }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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

  const handleSendMessage = () => {
    const message = {
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
    };
    // Emit the message to your backend to trigger the Pusher event
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