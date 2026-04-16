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
    try {
      const result = await api.login(email, password);
      if (result.success) {
        setUser(result.user);
        storageService.setCurrentUser(result.user);
        return { success: true, user: result.user };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }, []); // api is stable (imported), setUser stable

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
