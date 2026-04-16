import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize storage and check session
    const checkSession = async () => {
      const storedUser = storageService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  // Wrap in useCallback to prevent infinite loops in consumers
  const login = useCallback(async (email, password) => {
    // 🔥 MOCKED LOGIN FOR FRONTEND ONLY SIMULATION (No Backend Required)
    const mockUser = {
      id: "mock_user_123",
      name: "Demo Student",
      email: email,
      role: email.includes('admin') ? 'admin' : (email.includes('reviewer') ? 'reviewer' : 'student')
    };
    
    console.warn("Using mocked login bypass - Backend simulation mode");
    setUser(mockUser);
    storageService.setCurrentUser(mockUser);
    return { success: true, user: mockUser };
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const result = await api.register(userData);
      if (result.success) {
        // User must manually log in after registration
        return { success: true, user: result.user };
      }
      return { success: false, message: result.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    api.logout(); // Clear token
    storageService.clearSession();
  }, []);

  const contextValue = { user, login, register, logout, loading };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
