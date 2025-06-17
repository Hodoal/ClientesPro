const { User, Client } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclude password field
    });
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: 'Server error while retrieving users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclude password field
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: 'Server error while retrieving user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id: userIdToUpdate } = req.params;
    const { username, email, role } = req.body;
    const loggedInUserId = req.user.id; // ID of the admin performing the action

    // Prevent password updates through this endpoint
    if (req.body.password) {
      return res.status(400).json({ message: 'Password cannot be updated through this endpoint. Please use a dedicated password change function.' });
    }

    let user = await User.findByPk(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Prevent admin from removing their own admin rights if they are the sole admin
    if (user.id === loggedInUserId && user.role === 'admin' && role && role !== 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove admin role from the sole administrator.' });
      }
    }

    // Prevent changing ID
    if (req.body.id && req.body.id !== user.id) {
        return res.status(400).json({ message: 'Cannot change user ID.' });
    }


    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();

    // Exclude password from the response
    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(200).json({
      status: 'success',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error("Update User Error:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error while updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id: userIdToDelete } = req.params;
    const loggedInUserId = req.user.id; // ID of the admin performing the action

    if (userIdToDelete === loggedInUserId) {
      return res.status(400).json({ message: 'Cannot delete yourself as an administrator.' });
    }

    const user = await User.findByPk(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user to be deleted is the sole admin
    if (user.role === 'admin') {
        const adminCount = await User.count({ where: { role: 'admin' } });
        if (adminCount <= 1) {
            return res.status(400).json({ message: 'Cannot delete the sole administrator.' });
        }
    }


    // Additional consideration: What to do with clients associated with this user?
    // Option 1: Delete them (CASCADE DELETE in DB or manually here)
    // Option 2: Unassign them (set userId to null if allowed by Client model)
    // Option 3: Reassign them to another user (e.g., a default admin or the deleting admin)
    // For now, let's assume clients should be deleted if their owner is deleted.
    // This can be set up with `onDelete: 'CASCADE'` in the User.hasMany(Client) association.
    // If not set in model, manual deletion would be needed:
    // await Client.destroy({ where: { userId: userIdToDelete } });


    await user.destroy(); // This will also delete associated clients if CASCADE is set up

    res.status(204).send(); // No content
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: 'Server error while deleting user', error: error.message });
  }
};

// Client Statistics
exports.getClientStats = async (req, res) => {
  try {
    const totalClients = await Client.count();

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const newClientsThisMonth = await Client.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth,
          [Op.lt]: firstDayOfNextMonth
        }
      }
    });

    // Placeholder for clientsByStatus - assuming all clients are 'active' for now
    // If a 'status' field existed on the Client model, you could do:
    // const clientsByStatus = await Client.findAll({
    //   attributes: ['status', [fn('COUNT', col('status')), 'count']],
    //   group: ['status']
    // });

    // Placeholder for topPerformingClients - requires a metric
    // const topPerformingClients = []; // E.g., if clients had 'revenue' or 'projectsCompleted'

    res.status(200).json({
      status: 'success',
      data: {
        totalClients,
        newClientsThisMonth,
        clientsByStatus: { active: totalClients }, // Simplified placeholder
        // topPerformingClients: topPerformingClients // Placeholder
      }
    });

  } catch (error) {
    console.error("Get Client Stats Error:", error);
    res.status(500).json({ message: 'Server error while retrieving client statistics', error: error.message });
  }
};
