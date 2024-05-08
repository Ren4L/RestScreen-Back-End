'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'author',
        foreignKey: 'author_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.belongsTo(models.VideoCategory, {
        as: 'category',
        foreignKey: 'category_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.View, {
        foreignKey: 'video_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Comment, {
        foreignKey: 'video_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      this.hasOne(models.Favourite, {
        foreignKey: 'video_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Video.init({
    title: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    url: DataTypes.TEXT,
    author_id: DataTypes.INTEGER,
    poster: DataTypes.TEXT,
    duration: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};