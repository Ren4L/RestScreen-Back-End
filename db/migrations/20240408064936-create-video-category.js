'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('VideoCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: new Date(Date.now())
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: new Date(Date.now())
      }
    });
    await queryInterface.bulkInsert('VideoCategories', [
      {
        code: 'nature',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'auto',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'humor',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'education',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'entertainment',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'scienceAndTechnology',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('VideoCategories');
  }
};
