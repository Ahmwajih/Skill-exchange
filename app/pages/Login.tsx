'use client';

import { useAuth } from "@/hooks/useAuth";
import SignIn from "../components/SignIn";
import SignOut from "../components/SignOut";

export default function Home() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Welcome to My App</h1>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}