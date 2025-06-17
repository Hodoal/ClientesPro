import AsyncStorage from '@react-native-async-storage/async-storage';

class ClientsService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api';
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          resolve(clients);
        } catch (error) {
          reject(new Error('Error al obtener clientes'));
        }
      }, 800);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          const client = clients.find(c => c.id === id);
          
          if (client) {
            resolve(client);
          } else {
            reject(new Error('Cliente no encontrado'));
          }
        } catch (error) {
          reject(new Error('Error al obtener cliente'));
        }
      }, 500);
    });
  }

  async create(clientData) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          
          const newClient = {
            id: Date.now(),
            ...clientData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          clients.push(newClient);
          await AsyncStorage.setItem('clients', JSON.stringify(clients));
          
          resolve(newClient);
        } catch (error) {
          reject(new Error('Error al crear cliente'));
        }
      }, 800);
    });
  }

  async update(id, clientData) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          
          const index = clients.findIndex(c => c.id === id);
          if (index !== -1) {
            clients[index] = {
              ...clients[index],
              ...clientData,
              updatedAt: new Date().toISOString(),
            };
            
            await AsyncStorage.setItem('clients', JSON.stringify(clients));
            resolve(clients[index]);
          } else {
            reject(new Error('Cliente no encontrado'));
          }
        } catch (error) {
          reject(new Error('Error al actualizar cliente'));
        }
      }, 800);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          
          const filteredClients = clients.filter(c => c.id !== id);
          await AsyncStorage.setItem('clients', JSON.stringify(filteredClients));
          
          resolve(true);
        } catch (error) {
          reject(new Error('Error al eliminar cliente'));
        }
      }, 600);
    });
  }

  async search(term) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedClients = await AsyncStorage.getItem('clients');
          const clients = storedClients ? JSON.parse(storedClients) : [];
          
          const filteredClients = clients.filter(client =>
            client.name.toLowerCase().includes(term.toLowerCase()) ||
            client.email.toLowerCase().includes(term.toLowerCase()) ||
            client.phone.includes(term)
          );
          
          resolve(filteredClients);
        } catch (error) {
          reject(new Error('Error en la búsqueda'));
        }
      }, 400);
    });
  }
}

export const clientsService = new ClientsService();