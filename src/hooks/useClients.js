import { useState, useCallback } from 'react';
import { clientsService } from '../services/clients';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState(null);
  const [loading, setLoading] = useState(false); // For list operations
  const [clientLoading, setClientLoading] = useState(false); // For single client operations (fetch, update, delete)
  const [error, setError] = useState(null); // For list errors
  const [clientError, setClientError] = useState(null); // For single client errors

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.getAll();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('useClients fetchClients error:', err.message);
      setError(err.message || 'Failed to fetch clients');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addClient = useCallback(async (clientData) => {
    setClientLoading(true); // Use clientLoading for consistency or a specific addLoading
    setClientError(null);
    try {
      const newClient = await clientsService.create(clientData);
      if (newClient) {
        setClients((prevClients) => [...prevClients, newClient]);
        // Optionally, fetch all clients again if create affects sort order or other list properties
        // await fetchClients();
      } else {
        await fetchClients(); // Fallback if newClient isn't returned
      }
      return newClient;
    } catch (err) {
      console.error('useClients addClient error:', err.message);
      setClientError(err.message || 'Failed to add client'); // Set clientError
      throw err;
    } finally {
      setClientLoading(false);
    }
  }, [fetchClients]);

  const fetchClientById = useCallback(async (id) => {
    setClientLoading(true);
    setClientError(null);
    setCurrentClient(null); // Clear previous client
    try {
      const client = await clientsService.getById(id);
      setCurrentClient(client);
      return client;
    } catch (err) {
      console.error('useClients fetchClientById error:', err.message);
      setClientError(err.message || `Failed to fetch client ${id}`);
      setCurrentClient(null);
      throw err;
    } finally {
      setClientLoading(false);
    }
  }, []);

  const updateClient = useCallback(async (id, clientData) => {
    setClientLoading(true);
    setClientError(null);
    try {
      const updatedClient = await clientsService.update(id, clientData);
      setCurrentClient(updatedClient); // Update current client state
      // Update the client in the main list as well
      setClients((prevClients) =>
        prevClients.map(c => (c.id === id ? updatedClient : c))
      );
      return updatedClient;
    } catch (err) {
      console.error('useClients updateClient error:', err.message);
      setClientError(err.message || `Failed to update client ${id}`);
      throw err;
    } finally {
      setClientLoading(false);
    }
  }, []);

  const deleteClient = useCallback(async (id) => {
    setClientLoading(true);
    setClientError(null);
    try {
      await clientsService.delete(id);
      setClients((prevClients) => prevClients.filter(c => c.id !== id));
      if (currentClient && currentClient.id === id) {
        setCurrentClient(null); // Clear currentClient if it was the one deleted
      }
      return { success: true, id };
    } catch (err) {
      console.error('useClients deleteClient error:', err.message);
      setClientError(err.message || `Failed to delete client ${id}`);
      throw err;
    } finally {
      setClientLoading(false);
    }
  }, [currentClient]);


  return {
    clients,              // For list screen
    loading,              // For list screen operations
    error,                // For list screen errors
    currentClient,        // For detail/edit screen
    clientLoading,        // For single client operations
    clientError,          // For single client errors
    fetchClients,
    addClient,
    fetchClientById,
    updateClient,
    deleteClient,
  };
};
