import { LocalUser } from '@/types/auth';

// In-memory user storage (this will reset on page reload, but we can also use localStorage)
let users: LocalUser[] = [
  // Demo user for testing
  {
    id: '1',
    email: 'demo@mediconnect.com',
    fullName: 'Demo User',
    phone: '9876543210',
    createdAt: new Date().toISOString()
  }
];

let currentUser: LocalUser | null = null;

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const findUserByEmail = (email: string): LocalUser | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Auth functions
export const signUpLocal = async (email: string, password: string, fullName: string, phone?: string): Promise<{ user?: LocalUser; error?: { message: string } }> => {
  // Check if user already exists
  if (findUserByEmail(email)) {
    return { error: { message: 'User already registered' } };
  }

  // Validate password
  if (!validatePassword(password)) {
    return { error: { message: 'Password must be at least 6 characters long' } };
  }

  // Create new user
  const newUser: LocalUser = {
    id: generateId(),
    email: email.toLowerCase(),
    fullName,
    phone,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  currentUser = newUser;

  // Store in localStorage for persistence
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  return { user: newUser };
};

export const signInLocal = async (email: string, password: string): Promise<{ user?: LocalUser; error?: { message: string } }> => {
  const user = findUserByEmail(email);

  if (!user) {
    return { error: { message: 'Invalid login credentials' } };
  }

  // For demo purposes, we'll accept any password for existing users
  // In a real app, you'd hash and verify passwords
  if (!validatePassword(password)) {
    return { error: { message: 'Password must be at least 6 characters long' } };
  }

  currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  return { user };
};

export const signOutLocal = async (): Promise<{ error?: { message: string } }> => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  return {};
};

export const getCurrentUser = (): LocalUser | null => {
  if (currentUser) {
    return currentUser;
  }

  // Try to get from localStorage
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      return currentUser;
    } catch {
      localStorage.removeItem('currentUser');
    }
  }

  return null;
};

export const initializeUsers = () => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
    } catch {
      localStorage.removeItem('users');
    }
  }
  
  const storedCurrentUser = localStorage.getItem('currentUser');
  if (storedCurrentUser) {
    try {
      currentUser = JSON.parse(storedCurrentUser);
    } catch {
      localStorage.removeItem('currentUser');
    }
  }
};
