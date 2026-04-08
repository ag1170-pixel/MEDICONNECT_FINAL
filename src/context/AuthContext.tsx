import React, { createContext, useContext, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthUser } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error?: any; data?: any }>;
  signOut: () => Promise<{ error?: any }>;
  resendConfirmationEmail: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Treat everyone as signed-in with a dummy user
  const [user, setUser] = useState<AuthUser | null>({
    id: "demo-user",
    email: "demo@mediconnect.local",
    full_name: "Demo User",
  } as AuthUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Fake sign-in: mark user as logged in locally, no Supabase call
    setUser({
      id: "demo-user",
      email,
      full_name: "Demo User",
    } as AuthUser);
    setSession(null);
    setLoading(false);
    return { data: { user: { email } }, error: undefined };
  };

  const resendConfirmationEmail = async (email: string) => {
    // No-op in demo mode
    return { error: undefined };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    // Fake sign-up: immediately treat as signed-in
    setUser({
      id: "demo-user",
      email,
      full_name: fullName || "Demo User",
      phone,
    } as AuthUser);
    setSession(null);
    setLoading(false);
    return { data: { user: { email, full_name: fullName } }, error: undefined };
  };

  const signOut = async () => {
    // Fake sign-out: clear local user but keep app usable
    setSession(null);
    setUser(null);
    setLoading(false);
    return { error: undefined };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
