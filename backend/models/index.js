const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');

// Define associations
User.hasMany(Client, {
  foreignKey: 'userId',
  onDelete: 'CASCADE', // If a User is deleted, their Clients are also deleted
  hooks: true // Ensure hooks on Client model are triggered if any (e.g. beforeDestroy)
});
Client.belongsTo(User, { foreignKey: 'userId' }); // onDelete is not typically needed on BelongsTo for this scenario

const db = {
  sequelize,
  User,
  Client
};

module.exports = db;
