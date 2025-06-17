import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../config'; // Assuming a config file for API_BASE_URL

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Key used for storing token
    return token;
  } catch (e) {
    console.error('Failed to fetch auth token from AsyncStorage:', e);
    return null;
  }
};

const request = async (endpoint, method, body = null, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    ...options.headers, // Allow custom headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData)) { // FormData sets its own Content-Type
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }


  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = (body instanceof FormData) ? body : JSON.stringify(body);
  }

  // Ensure Config and API_BASE_URL are defined, with a fallback.
  const API_BASE_URL = (typeof Config !== 'undefined' && Config.API_BASE_URL)
    ? Config.API_BASE_URL
    : 'http://localhost:3000/api';

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 204 && (method === 'DELETE' || method === 'PUT') ) {
      // Handle No Content for DELETE and PUT (if backend returns 204 on successful PUT with no body)
      return { success: true, message: 'Operation successful (No Content)' };
    }

    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
    } else {
        const responseText = await response.text();
        if (response.ok) {
            responseData = { success: true, data: responseText };
        } else {
             console.error(`API Error (non-JSON response) for ${method} ${endpoint}: ${response.status} ${responseText}`);
             throw new Error(responseText || `HTTP error ${response.status}`);
        }
    }

    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText || `HTTP error ${response.status}`;
      console.error(`API Error for ${method} ${endpoint}: ${errorMessage}`, responseData);
      const error = new Error(errorMessage);
      error.response = response;
      error.data = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error(`Network/Request Error for ${method} ${endpoint}:`, error.message);
    if (!error.response) {
        error.isNetworkError = true;
    }
    throw error;
  }
};

const get = (endpoint, options = {}) => request(endpoint, 'GET', null, options);
const post = (endpoint, body, options = {}) => request(endpoint, 'POST', body, options);
const put = (endpoint, body, options = {}) => request(endpoint, 'PUT', body, options);
const del = (endpoint, options = {}) => request(endpoint, 'DELETE', null, options);

export default {
  get,
  post,
  put,
  delete: del,
  getAuthToken,
};
