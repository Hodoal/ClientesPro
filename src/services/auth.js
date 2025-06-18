import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate de que esta URL sea correcta
const API_URL = 'http://192.168.1.24:50001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email, password) => {
    try {
      console.log('Intentando login con:', { email });
      
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      console.log('Respuesta completa del servidor:', response);

      if (response.status === 403) {
        console.log('Error 403 - Detalles:', response.data);
        throw new Error(response.data.message || 'Credenciales inválidas');
      }

      const { token, user } = response.data;
      
      if (!token) {
        console.log('No se recibió token. Respuesta:', response.data);
        throw new Error('No se recibió el token del servidor');
      }

      // Guardar token y datos del usuario
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data));

      return { 
        success: true, 
        token, 
        user: response.data 
      };
    } catch (error) {
      console.log('Error detallado:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Respuesta del servidor incompleta');
      }

      // Guardar token y datos del usuario
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  },

  getStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      return { token, user };
    } catch (error) {
      console.error('Error al obtener datos guardados:', error);
      return { token: null, user: null };
    }
  },

  updateProfile: async (userId, userData, token) => {
    try {
      const response = await api.put(`/users/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const updatedUser = response.data.data;
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },
};