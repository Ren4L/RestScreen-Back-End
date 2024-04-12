'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.belongsTo(models.Video, {
        as: 'video',
        foreignKey: 'video_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });

    }
  }
  View.init({
    video_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    grade: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'View',
  });
  return View;
};