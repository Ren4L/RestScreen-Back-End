'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Friends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id_1: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Users',
          },
          key: "id"
        },
        allowNull: false,
      },
      user_id_2: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Users',
          },
          key: "id"
        },
        allowNull: false,
      },
      is_friend:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
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
    await queryInterface.dropTable('Friends');
  }
};
