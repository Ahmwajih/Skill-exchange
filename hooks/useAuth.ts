'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user is admin - you might want to check this against your database
      setIsAdmin(user.email === 'wajih212@hotmail.fr');
    }
  }, [user]);

  return { user, loading, error, isAdmin };
}