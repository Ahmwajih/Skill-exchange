
'use client';

import React from 'react';

const ChatSidebar = ({ onSelectConversation, conversations }) => {
  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray text-black">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <ul className="space-y-2 text-black">
        {conversations.map((conversation) => (
          <li
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className="p-2 bg-white text-black rounded-lg shadow-sm cursor-pointer hover:bg-blue-100"
          >
            {conversation.providerId.name || conversation.seekerId.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;

