import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulación de backend local para MVP
class AuthService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api'; // Cambiar por tu servidor local
    this.users = []; // Base de datos simulada
    this.currentId = 1;
  }

  // Simulación de API - reemplazar con llamadas reales al backend
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Verificar en AsyncStorage si existe el usuario
          const storedUsers = await AsyncStorage.getItem('users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            const token = `token_${Date.now()}_${Math.random()}`;
            const userData = {
              id: user.id,
              username: user.username,
              email: user.email,
              mobile: user.mobile,
            };
            
            // Guardar token
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            
            resolve({
              user: userData,
              token: token,
            });
          } else {
            reject(new Error('Credenciales inválidas'));
          }
        } catch (error) {
          reject(new Error('Error en el servidor'));
        }
      }, 1000); // Simular latencia de red
    });
  }

  async register(username, email, mobile, password) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Verificar usuarios existentes
          const storedUsers = await AsyncStorage.getItem('users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          
          // Verificar si el email ya existe
          const existingUser = users.find(u => u.email === email);
          if (existingUser) {
            reject(new Error('El email ya está registrado'));
            return;
          }
          
          // Crear nuevo usuario
          const newUser = {
            id: Date.now(),
            username,
            email,
            mobile,
            password, // En producción, esto debe estar hasheado
            createdAt: new Date().toISOString(),
          };
          
          users.push(newUser);
          await AsyncStorage.setItem('users', JSON.stringify(users));
          
          // Generar token
          const token = `token_${Date.now()}_${Math.random()}`;
          const userData = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            mobile: newUser.mobile,
          };
          
          // Guardar sesión
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          
          resolve({
            user: userData,
            token: token,
          });
        } catch (error) {
          reject(new Error('Error al registrar usuario'));
        }
      }, 1000);
    });
  }

  async logout() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          resolve(true);
        } catch (error) {
          reject(new Error('Error al cerrar sesión'));
        }
      }, 500);
    });
  }

  async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      
      if (token && user) {
        return {
          user: JSON.parse(user),
          token: token,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async forgotPassword(email) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const storedUsers = await AsyncStorage.getItem('users');
          const users = storedUsers ? JSON.parse(storedUsers) : [];
          
          const user = users.find(u => u.email === email);
          if (user) {
            // En producción, aquí enviarías un email
            console.log(`Código de recuperación enviado a: ${email}`);
            resolve({ message: 'Código de recuperación enviado' });
          } else {
            reject(new Error('Email no encontrado'));
          }
        } catch (error) {
          reject(new Error('Error en el servidor'));
        }
      }, 1000);
    });
  }
}

export const authService = new AuthService();