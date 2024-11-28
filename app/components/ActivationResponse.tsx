'use client';

import React from 'react';

const ActivationResponse = ({ response }) => {
  return (
    <div
      className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto"
      dangerouslySetInnerHTML={{ __html: response.welcomeMessage }} // Ensure this content is sanitized
    />
  );
};

export default ActivationResponse;
