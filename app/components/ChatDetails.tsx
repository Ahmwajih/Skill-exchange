
'use client';

import React from 'react';

const ChatDetails = ({ conversation, deal }) => {
  return (
    <div className="chat-details">
      <h2>Conversation Details</h2>
      <p><strong>Provider:</strong> {conversation.providerName}</p>
      <p><strong>Seeker:</strong> {conversation.seekerName}</p>
      <p><strong>Deal:</strong> {deal.timeFrame}, {deal.skillsOffered}, {deal.numberOfSessions} sessions</p>

      <style jsx>{`
        .chat-details {
          flex: 1;
          padding: 10px;
          border-left: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
};

export default ChatDetails;