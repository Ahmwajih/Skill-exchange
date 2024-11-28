'use client';
import React, { useEffect, useState } from "react";

export default function WelcomePage() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
const baseUrl = process.env.baseUrl || 'http://localhost:3000/';
  useEffect(() => {
    // Fetch the welcome message from the API
    fetch(`/api/auth/activate?token=${token}`)
    .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWelcomeMessage(data.welcomeMessage); // Store the sanitized message
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching welcome message:", error));
  }, []);

  return (
    <div>
      <h1>Welcome!</h1>
      <div dangerouslySetInnerHTML={{ __html: welcomeMessage }} />
    </div>
  );
}
