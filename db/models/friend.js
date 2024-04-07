'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user_1',
        foreignKey: 'user_id_1',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });

      this.belongsTo(models.User, {
        as: 'user_2',
        foreignKey: 'user_id_2',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Friend.init({
    user_id_1: DataTypes.INTEGER,
    user_id_2: DataTypes.INTEGER,
    is_friend: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};