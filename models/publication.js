'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Publication.hasMany(models.Comment)
      models.Publication.hasMany(models.Like)
      models.Publication.belongsTo(models.User, {
         as: "userId", foreingKey:'id'
        })
        models.Publication.belongsTo(models.Comment, {
          as: "commentId", foreingKey:'id'
         })
         models.Publication.belongsTo(models.Like, {
          as: "likeId", foreingKey:'id'
         })
    }
  }
  Publication.init({
    text: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};