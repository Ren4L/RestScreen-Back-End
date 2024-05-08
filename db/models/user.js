'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Friend, {
        foreignKey: 'user_id_1',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Friend, {
        foreignKey: 'user_id_2',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Video, {
        foreignKey: 'author_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.View, {
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Comment, {
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Chat, {
        foreignKey: 'user_id_1',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Chat, {
        foreignKey: 'user_id_2',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Message, {
        foreignKey: 'author_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Favourite, {
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  User.init({
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    photo: DataTypes.TEXT,
    banner: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};