import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services/api';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';

// Define the types for the user and authentication status
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: any;
  isActive: boolean;
  lastLogin?: string;
}

// Define the authentication credentials type
interface LoginCredentials {
  email: string;
  password: string;
  tenantDomain: string;
}

// Define the registration data type
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantDomain: string;
  schoolName?: string;
  domain?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminPassword?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create the authentication context
interface AuthContextProps {
  state: AuthState;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Create a custom hook to access the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const schoolId = localStorage.getItem('schoolId');

    const loadProfile = async () => {
      if (token && schoolId) {
        try {
          const profile = await api.getProfile();
          if (profile.success) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: profile.data });
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('schoolId');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('schoolId');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    loadProfile();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.login(credentials);
      
      if (response.success) {
        const user = response.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        handleApiSuccess('Login successful!');
        return true;
      } else {
        const errorMessage = response.message || 'Login failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        handleApiError(errorMessage, 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during login';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      handleApiError(error, 'Login failed');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await api.register(data);
      
      if (response.success) {
        const user = response.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        handleApiSuccess('Registration successful!');
        return true;
      } else {
        const errorMessage = response.message || 'Registration failed';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        handleApiError(errorMessage, 'Registration failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during registration';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      handleApiError(error, 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      dispatch({ type: 'LOGOUT' });
      handleApiSuccess('Logged out successfully');
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'LOGOUT' });
      handleApiError(error, 'Logout warning');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextProps = {
    state,
    user: state.user,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
