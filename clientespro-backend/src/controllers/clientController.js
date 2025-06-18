const Client = require('../models/Client');
const mongoose = require('mongoose');

// Get all clients
exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ owner: req.user.id, isActive: true });
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Get single client
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      owner: req.user.id,
      isActive: true
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// Create client
exports.createClient = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;

    // Check if client with same email already exists for this user
    const existingClient = await Client.findOne({
      email: req.body.email,
      owner: req.user.id,
      isActive: true
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cliente con este email'
      });
    }

    const client = await Client.create(req.body);
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// Update client
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        isActive: true
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};

// Delete client (soft delete)
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        isActive: true
      },
      { isActive: false },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get client stats
exports.getClientStats = async (req, res, next) => {
  try {
    const stats = await Client.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user.id),
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byStatus: {
            $push: "$status"
          },
          byPriority: {
            $push: "$priority"
          }
        }
      }
    ]);

    const result = {
      total: stats[0]?.total || 0,
      statusCounts: {},
      priorityCounts: {}
    };

    if (stats[0]) {
      stats[0].byStatus.forEach(status => {
        result.statusCounts[status] = (result.statusCounts[status] || 0) + 1;
      });

      stats[0].byPriority.forEach(priority => {
        result.priorityCounts[priority] = (result.priorityCounts[priority] || 0) + 1;
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Search clients
exports.searchClients = async (req, res, next) => {
  try {
    const { query } = req.query;
    const clients = await Client.find({
      owner: req.user.id,
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Get clients by status
exports.getClientsByStatus = async (req, res, next) => {
  try {
    const clients = await Client.find({
      owner: req.user.id,
      status: req.params.status,
      isActive: true
    });
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Get clients by priority
exports.getClientsByPriority = async (req, res, next) => {
  try {
    const clients = await Client.find({
      owner: req.user.id,
      priority: req.params.priority,
      isActive: true
    });
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Get clients for follow up
exports.getClientsForFollowUp = async (req, res, next) => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const clients = await Client.find({
      owner: req.user.id,
      isActive: true,
      lastContact: { $lt: twoWeeksAgo }
    });
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Export clients
exports.exportClients = async (req, res, next) => {
  try {
    const clients = await Client.find({
      owner: req.user.id,
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    next(error);
  }
};

// Update last contact
exports.updateLastContact = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        isActive: true
      },
      { lastContact: new Date() },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    next(error);
  }
};