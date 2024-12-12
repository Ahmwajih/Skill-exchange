'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeals } from '@/lib/features/deal/dealSlice';
import { RootState } from '@/lib/store';

const ChatDetails = ({ conversation, dealId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [deals, setDeals] = useState([]);

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        console.log('Deals fetched:', action.payload);
        if (action.payload) {
          setDeals(action.payload);
        } else if (action.error) {
          console.error("Failed to fetch deals:", action.error);
        }
      });
    }
  }, [user, dispatch]);

  const deal = deals.find((d) => d._id === dealId);

  return (
    <div className="chat-details bg-white text-black">
      <h2 className="font-poppins text-brown text-bold">Conversation Details</h2>
      <p><strong>Provider:</strong> {conversation.providerId.name}</p>
      <p><strong>Seeker:</strong> {conversation.seekerId.name}</p>
      {deal ? (
        <div>
          <p><strong>Time Frame:</strong> {deal.timeFrame}</p>
          <p><strong>Skill Offered:</strong> {deal.skillOffered}</p>
        </div>
      ) : (
        <p>Loading deal details...</p>
      )}

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
