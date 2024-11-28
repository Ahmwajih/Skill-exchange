import React from "react";

interface WelcomeMessageProps {
  message: string; 
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ message }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default WelcomeMessage;
