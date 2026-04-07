import { useState, useEffect } from 'react';

interface MockAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<MockAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading auth state
    const timer = setTimeout(() => {
      // For demo purposes, we'll set a mock user
      setUser({
        id: 'demo-user',
        email: 'demo@mediconnect.com',
        name: 'Demo User',
        role: 'patient'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate sign in
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: 'demo-user',
      email,
      name: 'Demo User',
      role: 'patient'
    });
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate sign up
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: 'demo-user',
      email,
      name,
      role: 'patient'
    });
    return { error: null };
  };

  const signOut = async () => {
    // Simulate sign out
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
}
