import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User type for temporary use without Firebase
interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start as false since no auth check needed

  // Mock authentication functions
  const handleSignIn = async (email: string, password: string) => {
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign in
      const mockUser: User = {
        id: 'mock-user-id',
        email: email,
        displayName: email.split('@')[0],
        createdAt: new Date(),
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Error en signIn:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    try {
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful sign up
      const mockUser: User = {
        id: 'mock-user-id-' + Date.now(),
        email: email,
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Error en signUp:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      // Simulate sign out delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
    } catch (error) {
      console.error('Error en signOut:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 