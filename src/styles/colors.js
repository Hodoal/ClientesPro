export const colors = {
  primary: '#2196F3',     // Azul principal
  secondary: '#FF9800',   // Naranja secundario
  success: '#4CAF50',     // Verde para éxito
  danger: '#F44336',      // Rojo para errores
  warning: '#FFC107',     // Amarillo para advertencias
  info: '#03A9F4',        // Azul claro para información
  light: '#F5F5F5',      // Gris muy claro
  dark: '#212121',       // Casi negro
  white: '#FFFFFF',      // Blanco
  black: '#000000',      // Negro
  gray: {
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Estados de clientes
  clientStatus: {
    active: '#4CAF50',    // Verde
    inactive: '#F44336',  // Rojo
    pending: '#FFC107',   // Amarillo
  },
  // Prioridades
  priority: {
    high: '#F44336',     // Rojo
    medium: '#FF9800',    // Naranja
    low: '#4CAF50',      // Verde
  },
  // Transparencias
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Tema claro
export const lightTheme = {
  background: colors.white,
  text: colors.dark,
  border: colors.gray[300],
  card: colors.white,
  primary: colors.primary,
  secondary: colors.secondary,
};

// Tema oscuro
export const darkTheme = {
  background: colors.dark,
  text: colors.white,
  border: colors.gray[700],
  card: colors.gray[800],
  primary: colors.primary,
  secondary: colors.secondary,
};

export default colors;