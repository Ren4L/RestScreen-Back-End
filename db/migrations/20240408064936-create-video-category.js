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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.bulkInsert('VideoCategories', [
      {
        code: 'CategoryVideo.nature',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'CategoryVideo.auto',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'CategoryVideo.humor',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'CategoryVideo.education',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'CategoryVideo.entertainment',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        code: 'CategoryVideo.scienceAndTechnology',
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('VideoCategories');
  }
};
