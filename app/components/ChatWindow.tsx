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
  const [selectedDealId, setSelectedDealId] = useState(dealId || null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        if (!action.error && Array.isArray(action.payload)) {
          const deal = dealId
            ? action.payload.find((deal) => deal._id === dealId)
            : action.payload[0];
          if (deal) setSelectedDealId(deal._id);
        }
      });

      dispatch(fetchConversations(user.id)).then((action) => {
        if (!action.error && Array.isArray(action.payload)) {
          setConversations(action.payload);
        }
      });
    }
  }, [user, dealId, dispatch]);

  useEffect(() => {
    socket.connect();
    return () => socket.disconnect();
  }, []);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Fetch the updated conversation data
    dispatch(fetchConversations(user.id)).then((action) => {
      if (!action.error && Array.isArray(action.payload)) {
        const updatedConversation = action.payload.find(c => c._id === conversation._id);
        if (updatedConversation) {
          setSelectedConversation(updatedConversation);
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        onSelectConversation={handleSelectConversation}
        conversations={conversations}
      />

      <div className="flex flex-col flex-1">
        {selectedConversation ? (
          <>
            <ChatMessages
              conversation={selectedConversation}
              socket={socket}
              user={user}
            />
            {selectedDealId && (
              <ChatDetails
                conversation={selectedConversation}
                dealId={selectedDealId}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray bg-white">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
