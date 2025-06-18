const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  // Matar todos los procesos de Node
  try {
    execSync('killall node', { stdio: 'inherit' });
  } catch (error) {
    console.log('No hay procesos de Node.js activos');
  }

  // Limpiar caché
  const cachePath = path.join(__dirname, 'node_modules', '.cache');
  if (fs.existsSync(cachePath)) {
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('Cache limpiada');
  }

  console.log('Limpieza completada');
} catch (error) {
  console.error('Error durante la limpieza:', error);
}