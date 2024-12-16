import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { fetchDeals } from '@/lib/features/deal/dealSlice';
import { fetchConversations } from '@/lib/features/conversation/conversationSlice';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatDetails from './ChatDetails';
import pusher from '@/Utils/socket';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        if (!action.error && Array.isArray(action.payload)) {
          const deal = action.payload[0];
          if (deal) setSelectedDealId(deal._id);
        }
      });

      dispatch(fetchConversations(user.id)).then((action) => {
        if (!action.error && Array.isArray(action.payload)) {
          setConversations(action.payload);
        }
      });
    }
  }, [user, dispatch]);

  useEffect(() => {
    const channel = pusher.subscribe('conversation-channel');
    channel.bind('deal-accepted', () => {
      if (user) {
        dispatch(fetchConversations(user.id)).then((action) => {
          if (!action.error && Array.isArray(action.payload)) {
            setConversations(action.payload);
          }
        });
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [user, dispatch]);

  const handleSelectConversation = (conversations) => {
    setSelectedConversations(conversations);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <ChatSidebar
        onSelectConversation={handleSelectConversation}
        conversations={conversations}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedConversations.length > 0 ? (
          <>
            {selectedConversations.map((conversation) => (
              <ChatMessages
                key={conversation._id}
                conversation={conversation}
                user={user}
              />
            ))}
            {selectedDealId && (
              <ChatDetails
                conversation={selectedConversations[0]}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 bg-white">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
