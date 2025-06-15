
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getProfile();
          if (response.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.login(credentials);
      if (response.success) {
        const profileResponse = await api.getProfile();
        if (profileResponse.success) {
          setUser(profileResponse.data.user);
          toast.success('Login successful!');
          return true;
        }
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.register(data);
      if (response.success) {
        setUser(response.data.user);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshProfile = async () => {
    try {
      const response = await api.getProfile();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
