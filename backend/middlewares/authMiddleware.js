const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming models/index.js exports User

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');

      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] } // Do not include password
      });

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found for this token' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.name, error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token failed (invalid signature or malformed)' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token processing failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) { // Should be called after protect, so req.user is available
        return res.status(403).json({ message: 'User not identified for authorization check.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route. Allowed roles: ${roles.join(', ')}` });
    }
    next();
  };
};
