import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const { token, user } = await authService.getStoredAuth();
      if (token && user) {
        setToken(token);
        setUser(user);
      }
    } catch (error) {
      console.error('Error al cargar autenticación:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { token, user } = await authService.login(email, password);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { token, user } = await authService.register(userData);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(user.id, userData, token);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};