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
      },
      code:{
        type: Sequelize.INTEGER,
      },
      photo:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      banner:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description:{
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password:{
        type: Sequelize.STRING(64),
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
      },
      {
        nickname: 'Archive2',
        email: 'archive2@target.the',
        password: '$2b$04$qjwsNgYrcq/6azn6xWs0qut2zJd6rCC.nl5LQ1FjIfUR4H/OEIhLG',
        salt: 437,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        nickname: 'Archive3',
        email: 'archive3@target.the',
        password: '$2b$04$qjwsNgYrcq/6azn6xWs0qut2zJd6rCC.nl5LQ1FjIfUR4H/OEIhLG',
        salt: 437,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        nickname: 'Archive4',
        email: 'archive4@target.the',
        password: '$2b$04$qjwsNgYrcq/6azn6xWs0qut2zJd6rCC.nl5LQ1FjIfUR4H/OEIhLG',
        salt: 437,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now())
      },
      {
        nickname: 'Archive5jk',
        email: 'archiasdsadve5@target.the',
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