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
      // Fetch deals
      dispatch(fetchDeals(user.id)).then((action) => {
        if (action.error) {
          console.error("Failed to fetch deals:", action.error);
        } else if (Array.isArray(action.payload)) {
          console.log("Fetched Deals:", action.payload);

          const deal = dealId
            ? action.payload.find((deal) => deal._id === dealId)
            : action.payload[0];
          if (deal) {
            setSelectedDealId(deal._id);
          }
        }
      });

      // Fetch conversations
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
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="chat-window bg-white text-black">
      {/* Sidebar */}
      <ChatSidebar
        onSelectConversation={setSelectedConversation}
        conversations={conversations}
      />

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="chat-main bg-white text-black">
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
        </div>
      ) : (
        <div className="no-conversation bg-white text-black">Select a conversation to start chatting</div>
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
