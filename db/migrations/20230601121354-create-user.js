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
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      banner:{
        type: Sequelize.TEXT('long'),
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
    await queryInterface.bulkInsert('Users', [
      {
        nickname: 'Ren4L',
        email: 'vladisakov28@gmail.com',
        password: '$2b$04$FO4.7US58g8wTgQPILEtKugzqEv6sNc9k6AOxv6p8idrh8ChHmoKG',
        salt: 533,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        nickname: 'Archive',
        email: 'archive@target.the',
        password: '$2b$04$qjwsNgYrcq/6azn6xWs0qut2zJd6rCC.nl5LQ1FjIfUR4H/OEIhLG',
        salt: 437,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      }
    ])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};