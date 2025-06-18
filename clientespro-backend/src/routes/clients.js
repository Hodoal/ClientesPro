// ========== src/routes/clients.js (VERSIÓN COMPLETA) ==========
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/auth');
const {
  validateClient,
  handleValidationErrors
} = require('../middleware/validation');

// Proteger todas las rutas
router.use(protect);

// Rutas especiales (deben ir antes de las rutas con parámetros)
router.get('/stats', clientController.getClientStats);
router.get('/search', clientController.searchClients);
router.get('/follow-up', clientController.getClientsForFollowUp);
router.get('/export', clientController.exportClients);
router.get('/by-status/:status', clientController.getClientsByStatus);
router.get('/by-priority/:priority', clientController.getClientsByPriority);

// Rutas principales
router
  .route('/')
  .get(clientController.getClients)
  .post(validateClient, handleValidationErrors, clientController.createClient);

router
  .route('/:id')
  .get(clientController.getClient)
  .put(validateClient, handleValidationErrors, clientController.updateClient)
  .delete(clientController.deleteClient);

// Ruta para actualizar último contacto
router.put('/:id/contact', clientController.updateLastContact);

module.exports = router;