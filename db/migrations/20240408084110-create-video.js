'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:{
            tableName: 'VideoCategories',
          },
          key: "id"
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model:{
            tableName: 'Users',
          },
          key: "id"
        },
      },
      poster: {
        type: Sequelize.TEXT('long')
      },
      duration:{
        allowNull: false,
        type: Sequelize.TIME,
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos');
  }
};
