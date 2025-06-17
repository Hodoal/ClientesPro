const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming models/index.js exports User

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_super_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }
    // Basic email validation (Sequelize model validation also handles this)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 3. Create new user (password hashing is handled by the model hook)
    const newUser = await User.create({
      username,
      email,
      password,
      // role will default to 'user' as per model definition
    });

    // 4. Generate JWT
    const token = generateToken(newUser.id, newUser.role);

    // 5. Return response (excluding password)
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials - user not found' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials - password incorrect' });
    }

    // 4. Generate JWT
    const token = generateToken(user.id, user.role);

    // 5. Return response (excluding password)
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  // req.user is attached by the 'protect' middleware
  if (!req.user) {
    // This case should ideally be caught by the protect middleware itself
    return res.status(401).json({ message: 'Not authorized, user data not found in request' });
  }

  // The user object (excluding password) is already available in req.user
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};
