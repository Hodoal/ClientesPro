const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getClientStats
} = require('../controllers/adminController');

// Apply protect and authorize middleware to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Statistics routes
router.get('/stats/clients', getClientStats);

module.exports = router;
