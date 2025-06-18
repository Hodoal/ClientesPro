const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar nuevo usuario
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const user = await User.create({ name, email, password, phone });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Por favor proporciona email y contraseña'
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// Obtener perfil del usuario autenticado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil'
    });
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res) => {
  const updates = (({ name, phone }) => ({ name, phone }))(req.body);

  try {
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el perfil'
    });
  }
};

// Actualizar contraseña
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la contraseña'
    });
  }
};

// Cerrar sesión (opcional en backend)
exports.logout = async (req, res) => {
  // En frontend se borra el token, pero aquí puedes invalidar la sesión si usas cookies
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada'
  });
};

// Recuperar contraseña
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No hay usuario con ese email'
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email de recuperación enviado',
      resetToken: resetToken // Solo para desarrollo
    });
  } catch (error) {
    next(error);
  }
};
