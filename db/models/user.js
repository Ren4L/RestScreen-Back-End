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
    }
  }
  User.init({
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};