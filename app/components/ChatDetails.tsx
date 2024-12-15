/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeals } from '@/lib/features/deal/dealSlice';
import { RootState } from '@/lib/store';

const ChatDetails = ({ conversation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [deals, setDeals] = useState([]);
  const [expandedDealId, setExpandedDealId] = useState(null);
  const [isDealsExpanded, setIsDealsExpanded] = useState(false);

  const toggleDealExpansion = (dealId) => {
    setExpandedDealId(expandedDealId === dealId ? null : dealId);
  };

  const toggleDealsExpansion = () => {
    setIsDealsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchDeals(user.id)).then((action) => {
        if (action.payload) {
          setDeals(action.payload);
        } else if (action.error) {
          console.error("Failed to fetch deals:", action.error);
        }
      });
    }
  }, [user, dispatch]);

  if (!conversation) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-white border-t border-gray overflow-y-auto">
      <h2 className="mb-4 text-lg font-bold text-orange">Deal Details</h2>
      <p>
        <strong className="text-brown">Provider:</strong> {conversation.providerId?.name || 'N/A'}
      </p>
      <p>
        <strong className="text-brown">Seeker:</strong> {conversation.seekerId?.name || 'N/A'}
      </p>
      <div className="mt-4">
        <h3 className="text-md font-bold text-brown cursor-pointer" onClick={toggleDealsExpansion}>
          Deals:
        </h3>
        {isDealsExpanded && (
          <ul>
            {deals.map((deal) => (
              <li key={deal._id} className="mt-2">
                <div onClick={() => toggleDealExpansion(deal._id)} className="cursor-pointer">
                  <p><strong>Time Frame:</strong> {deal.timeFrame}</p>
                  <p><strong>Skill Offered:</strong> {deal.skillOffered}</p>
                  <p><strong>Number of Sessions:</strong> {deal.numberOfSessions}</p>
                </div>
                {expandedDealId === deal._id && (
                  <div className="mt-2">
                    <p><strong>Additional Detail 1:</strong> {deal.additionalDetail1}</p>
                    <p><strong>Additional Detail 2:</strong> {deal.additionalDetail2}</p>
                    {/* Add more details as needed */}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatDetails;
