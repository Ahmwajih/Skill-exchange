'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';


const ChatSidebar = ({ onSelectConversation, conversations }) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const uniqueConversations = conversations.reduce((acc, conversation) => {
    if (!acc.some(c => c.providerId._id === conversation.providerId._id)) {
      acc.push(conversation);
    }
    return acc;
  }, []);

  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray text-black">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <ul className="space-y-2 text-black">
        {uniqueConversations.map((conversation) => (
          <li
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className="p-2 bg-white text-black rounded-lg shadow-sm cursor-pointer hover:bg-blue-100"
          >
            {conversation.providerId._id === user.id ? conversation.seekerId.name : conversation.providerId.name}
            </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;

