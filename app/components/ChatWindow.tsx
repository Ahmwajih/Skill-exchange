'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchDeals } from '@/lib/features/deal/dealSlice';
import { fetchConversations } from '@/lib/features/conversation/conversationSlice';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatDetails from './ChatDetails';
import socket from '@/Utils/socket';

const ChatWindow = ({ dealId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [deal, setDeal] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        console.log("action", action);
        if (action.error) {
          console.error("Failed to fetch deals:", action.error);
        } else if (Array.isArray(action.payload)) {
          const fetchedDeal = action.payload.find(deal => deal._id === dealId);
          setDeal(fetchedDeal);
        }
      });
      dispatch(fetchConversations(user.id)).then((action) => {
        if (action.error) {
          console.error("Failed to fetch conversations:", action.error);
        } else if (Array.isArray(action.payload)) {
          setConversations(action.payload);
        }
      });
    }
  }, [user, dealId, dispatch]);

  useEffect(() => {
    setSocketInstance(socket);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [socketInstance]);


  return (
    <div className="chat-window">
      {/* Sidebar */}
      <ChatSidebar onSelectConversation={setSelectedConversation} conversations={conversations} />

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="chat-main">
          <ChatMessages conversation={selectedConversation} socket={socketInstance} user={user} />
          <ChatDetails conversation={selectedConversation} deal={deal} />
        </div>
      ) : (
        <div className="no-conversation">Select a conversation to start chatting</div>
      )}

      <style jsx>{`
        .chat-window {
          display: flex;
          height: 100vh;
          border: 1px solid #ccc;
        }
        .chat-main {
          flex: 3;
          display: flex;
          flex-direction: column;
        }
        .no-conversation {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;