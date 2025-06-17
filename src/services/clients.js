import api from './api'; // Assuming api.js exports { get, post, put, delete }

const API_ENDPOINT = '/clients';

class ClientsService {
  async getAll() {
    try {
      // Expected backend response for GET /api/clients:
      // { status: 'success', results: clients.length, data: { clients: [...] } }
      // The api.get method should parse this.
      const response = await api.get(API_ENDPOINT);
      // Ensure accessing the correct part of the response.
      // If api.get returns the full {status, data: {clients}}, then response.data.clients
      // If api.get directly returns the content of 'data', then response.clients
      // If api.get directly returns the array, then response itself
      return response?.data?.clients || response?.clients || response || [];
    } catch (error) {
      console.error('Error in clientsService.getAll:', error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      // Expected backend: { status: 'success', data: { client: {...} } }
      const response = await api.get(`${API_ENDPOINT}/${id}`);
      return response?.data?.client || response?.client;
    } catch (error) {
      console.error(`Error in clientsService.getById for ID ${id}:`, error.message);
      throw error;
    }
  }

  async create(clientData) {
    try {
      // Expected backend: { status: 'success', data: { client: newClient } }
      const response = await api.post(API_ENDPOINT, clientData);
      return response?.data?.client || response?.client;
    } catch (error) {
      console.error('Error in clientsService.create:', error.message);
      throw error;
    }
  }

  async update(id, clientData) {
    try {
      // Expected backend: { status: 'success', data: { client: updatedClient } }
      const response = await api.put(`${API_ENDPOINT}/${id}`, clientData);
      return response?.data?.client || response?.client;
    } catch (error) {
      console.error(`Error in clientsService.update for ID ${id}:`, error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      // Expected backend: 204 No Content, or { status: 'success', data: null }
      // api.delete should handle 204 appropriately.
      await api.delete(`${API_ENDPOINT}/${id}`);
      return { id }; // Return id for potential use in UI state updates.
    } catch (error) {
      console.error(`Error in clientsService.delete for ID ${id}:`, error.message);
      throw error;
    }
  }
}

export const clientsService = new ClientsService();
