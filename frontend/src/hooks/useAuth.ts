import { useState, useEffect, useCallback } from 'react';
import type { User, AuthState, LoginCredentials, SignupCredentials } from '@/types';
import { authApi } from '@/services/api';

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const response = await authApi.getSession();
      if (response.success && response.data) {
        setState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const response = await authApi.login(credentials);
    
    if (response.success && response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: response.error };
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const response = await authApi.signup(credentials);
    
    if (response.success && response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true };
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    return { success: false, error: response.error };
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
  };
}
