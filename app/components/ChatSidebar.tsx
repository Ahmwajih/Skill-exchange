'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Pusher from 'pusher-js';

const ChatSidebar = ({ onSelectConversation, conversations }) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const pusher = new Pusher('b85eae341f11d9507db7', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe('presence-online-users');
    channel.bind('pusher:subscription_succeeded', (members) => {
      setOnlineUsers(Object.keys(members.members));
    });

    channel.bind('pusher:member_added', (member) => {
      setOnlineUsers((prevUsers) => [...prevUsers, member.id]);
    });

    channel.bind('pusher:member_removed', (member) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== member.id));
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const isUserOnline = (userId) => onlineUsers.includes(userId);

  const uniqueConversations = conversations.reduce((acc, conversation) => {
    if (!acc.some(c => c._id === conversation._id)) {
      acc.push(conversation);
    }
    return acc;
  }, []);

  return (
    <div className="w-full md:w-1/4 bg-white p-4 border-r border-gray-300 text-black">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <ul className="space-y-2 text-black">
        {uniqueConversations.map((conversation) => (
          <li
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-2 rounded-lg shadow-sm cursor-pointer hover:bg-blue ${
              conversation.unread ? 'bg-orange' : 'bg-white'
            }`}
          >
            <div className="flex items-center">
              <span className={`h-2 w-2 rounded-full mr-2 ${isUserOnline(conversation.providerId._id) || isUserOnline(conversation.seekerId._id) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              {conversation.providerId._id === user.id ? conversation.seekerId.name : conversation.providerId.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;

