const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite' // This file will be created in the backend directory
});

module.exports = sequelize;
