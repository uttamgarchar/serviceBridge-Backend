import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('sb_token');
    const storedUser = localStorage.getItem('sb_user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({ user, token: storedToken, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('sb_token');
        localStorage.removeItem('sb_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await authService.login(credentials);

      if (data.success && data.token && data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role as UserRole,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('sb_token', data.token);
        localStorage.setItem('sb_user', JSON.stringify(user));

        setState({ user, token: data.token, isAuthenticated: true, isLoading: false });
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed. Please try again.' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const result = await authService.register(data);
      return { success: result.success, error: result.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Logout locally even if API fails
    }
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const result = await authService.verifyOtp({ email, otp });
      return { success: result.success, error: result.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'OTP verification failed.' };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const result = await authService.resendOtp({ email });
      return { success: result.success, error: result.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to resend OTP.' };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const result = await authService.forgotPassword({ email });
      return { success: result.success, error: result.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset code.' };
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const result = await authService.resetPassword({ email, otp, newPassword });
      return { success: result.success, error: result.message };
    } catch (error: any) {
      return { success: false, error: error.message || 'Password reset failed.' };
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('sb_user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Map backend roles to frontend route prefixes
export const getRoleBasePath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    User: '/user',
    ServiceProvider: '/provider',
    ProviderManager: '/manager',
    VerificationManager: '/verification',
    Admin: '/admin',
  };
  return paths[role];
};
