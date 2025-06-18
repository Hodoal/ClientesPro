const User = require('../models/User');

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    };

    // No permitir actualizar email directamente
    if (req.body.email && req.body.email !== req.user.email) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cambiar el email desde este endpoint'
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Desactivar cuenta
// @route   DELETE /api/users/account
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Cuenta desactivada correctamente'
    });
  } catch (error) {
    next(error);
  }
};