'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id:{
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nickname:{
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      email:{
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      salt:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      photo:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password:{
        type: Sequelize.STRING(64),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};