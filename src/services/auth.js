import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Uses the newly implemented api.js

const USER_KEY = 'user';
const TOKEN_KEY = 'userToken';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      // Backend /api/auth/login is expected to return:
      // { status: 'success', token, data: { user } }
      const response = await api.post('/auth/login', { email, password });
      if (response && response.token && response.data?.user) {
        const { user } = response.data;
        const { token } = response;

        // Store user and token
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_KEY, token);

        return { user, token };
      }
      throw new Error(response?.message || 'Login failed: Invalid response structure from server.');
    } catch (error) {
      console.error('AuthService Login Error:', error.message);
      throw error;
    }
  }

  // Register user
  async register(userData) { // userData: { username, email, password, (optional: mobile) }
    try {
      // Backend /api/auth/register is expected to return:
      // { status: 'success', token, data: { user } }
      const response = await api.post('/auth/register', userData);
      if (response && response.token && response.data?.user) {
        const { user } = response.data;
        const { token } = response;

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        await AsyncStorage.setItem(TOKEN_KEY, token);

        return { user, token };
      }
      throw new Error(response?.message || 'Registration failed: Invalid response structure from server.');
    } catch (error) {
      console.error('AuthService Register Error:', error.message);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Optional: Call a backend logout endpoint if it exists
      // await api.post('/auth/logout', {});

      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('AuthService Logout Error:', error.message);
      await AsyncStorage.removeItem(USER_KEY).catch(e => console.error("Logout: User key removal failed", e));
      await AsyncStorage.removeItem(TOKEN_KEY).catch(e => console.error("Logout: Token key removal failed", e));
      // Depending on app's needs, may or may not want to throw here.
      // If logout is user-initiated, usually UI proceeds regardless of backend error.
    }
  }

  // Get current user and token from storage
  async getCurrentUser() {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      const token = await AsyncStorage.getItem(TOKEN_KEY);

      if (userString && token) {
        return {
          user: JSON.parse(userString),
          token: token,
        };
      }
      return null;
    } catch (error) {
      console.error('AuthService getCurrentUser Error:', error.message);
      return null;
    }
  }

  async verifyToken() {
    try {
      // GET /api/auth/me is expected to return current user if token is valid
      const response = await api.get('/auth/me'); // This will use the token from AsyncStorage via api.js
      if (response && response.data?.user) {
        // Re-store user data to keep it fresh, as it might have changed server-side
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        return response.data.user; // Return the (potentially updated) user object
      }
      // If /auth/me doesn't return user as expected, or if api.get throws for non-OK
      await this.logout(); // Clear invalid/expired token and user
      return null;
    } catch (error) {
      console.error('AuthService verifyToken Error:', error.message);
      // If token verification fails (e.g. 401 from api.js), logout
      // api.js should throw an error for non-OK responses, so this catch block will handle it.
      await this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
