
'use client';

import React from 'react';

const ChatSidebar = ({ onSelectConversation, conversations }) => {
  return (
    <div className="chat-sidebar">
      <h2>Conversations</h2>
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation._id} onClick={() => onSelectConversation(conversation)}>
            {conversation.providerName || conversation.seekerName}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .chat-sidebar {
          flex: 1;
          border-right: 1px solid #ccc;
          padding: 10px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 10px;
          cursor: pointer;
        }
        li:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default ChatSidebar;