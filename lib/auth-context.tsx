'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  authMethod: 'email' | 'biometric';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signInBiometric: () => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('auth_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUpEmail = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // In production, this would call your backend API
    const newUser: User = {
      id: Date.now().toString(),
      email,
      authMethod: 'email',
    };

    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_email', email); // For demo purposes
    setUser(newUser);
  };

  const signInEmail = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // In production, this would verify against your backend
    const storedEmail = localStorage.getItem('auth_email');
    if (storedEmail !== email) {
      throw new Error('Invalid email or password');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      authMethod: 'email',
    };

    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signInBiometric = async () => {
    if (!window.PublicKeyCredential) {
      throw new Error('Biometric authentication is not supported on this device');
    }

    try {
      // Get available authenticators
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        throw new Error('Biometric authenticator not available');
      }

      // Request biometric authentication
      const response = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: 'required',
        },
      });

      if (!response) {
        throw new Error('Biometric authentication failed');
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: 'biometric@lifewithmystic.local',
        authMethod: 'biometric',
      };

      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUpEmail, signInEmail, signInBiometric, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
