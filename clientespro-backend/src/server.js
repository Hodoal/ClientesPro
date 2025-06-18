const app = require('./app');
const connectDB = require('./config/database');

// Conectar a la base de datos
connectDB();

const startServer = async (port) => {
  try {
    const server = app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en puerto ${port} en modo ${process.env.NODE_ENV}`);
    });

    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`❌ El puerto ${port} está en uso. Intentando con el puerto ${port + 1}`);
        server.close();
        startServer(port + 1);
      } else {
        console.log(`❌ Error del servidor:`, error);
        process.exit(1);
      }
    });

    // Manejo de errores no capturados
    process.on('unhandledRejection', (err, promise) => {
      console.log(`❌ Error: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });

    // Manejo de señales de terminación
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM recibido. Cerrando el servidor');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.log('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar con el puerto 5000
startServer(process.env.PORT || 5000);
