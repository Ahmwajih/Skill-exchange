'use client';

import { useAuth } from "@/hooks/useAuth";
import SignIn from "../components/SignIn";
import SignOut from "../components/SignOut";

export default function Login() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName} ||  {user.email}</p>
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}