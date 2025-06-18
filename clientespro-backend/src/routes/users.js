const express = require('express');
const {
  getProfile,
  updateProfile,
  deactivateAccount
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

router
  .route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.delete('/account', deactivateAccount);

module.exports = router;