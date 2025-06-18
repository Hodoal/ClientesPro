const crypto = require('crypto');

// Generar token aleatorio
exports.generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Formatear fecha
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Validar email
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar teléfono
exports.isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// Generar slug
exports.generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Capitalizar primera letra
exports.capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
exports.truncate = (str, length = 100) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// Generar ID único
exports.generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Filtrar objeto para remover propiedades undefined/null
exports.filterObject = (obj) => {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

// Paginar resultados
exports.paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

// Calcular información de paginación
exports.getPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext,
    hasPrev,
    nextPage: hasNext ? page + 1 : null,
    prevPage: hasPrev ? page - 1 : null
  };
};
