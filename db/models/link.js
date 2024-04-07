'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Link.init({
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    icon: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Link',
  });
  return Link;
};