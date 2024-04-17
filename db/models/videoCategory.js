'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Video, {
        foreignKey: 'category_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  VideoCategory.init({
    code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VideoCategory',
  });
  return VideoCategory;
};