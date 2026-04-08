import React from 'react';
import { useAuth } from '@/context/AuthContext';

export const AuthTest: React.FC = () => {
  const { user, session, loading } = useAuth();

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Auth State Test</h3>
      <div className="text-sm space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user.email) : 'Not logged in'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'No session'}</p>
      </div>
    </div>
  );
};
