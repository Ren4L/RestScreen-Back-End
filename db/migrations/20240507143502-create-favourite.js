'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favourites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Users',
          },
          key: "id"
        },
        allowNull: false,
      },
      video_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Videos',
          },
          key: "id"
        },
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Favourites');
  }
};