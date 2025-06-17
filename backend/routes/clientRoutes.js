const express = require('express');
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All client routes are protected and require at least 'user' role
router.use(protect);

// POST /api/clients
router.post('/', authorize('admin', 'user'), createClient); // Both admin and user can create

// GET /api/clients
router.get('/', authorize('admin', 'user'), getClients); // Both admin and user can view

// GET /api/clients/:id
router.get('/:id', authorize('admin', 'user'), getClientById); // Both admin and user can view specific client

// PUT /api/clients/:id
router.put('/:id', authorize('admin', 'user'), updateClient); // Both admin and user can update (consider if only admin should update)

// DELETE /api/clients/:id
router.delete('/:id', authorize('admin'), deleteClient); // Only admin can delete

module.exports = router;
