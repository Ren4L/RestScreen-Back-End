'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Chats',
          },
          key: "id"
        },
        allowNull: false,
      },
      author_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName: 'Users',
          },
          key: "id"
        },
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      view: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    await queryInterface.dropTable('Messages');
  }
};