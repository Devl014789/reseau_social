'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Publication, {
        through: models.Comment,
        foreignKey: 'userId',
        otherKey: 'publicationId'
      })
      models.Publication.belongsToMany(models.User, {
        through: models.Comment,
        foreignKey: 'publicationId',
        otherKey: 'userId'
      })
      models.Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
      models.Comment.belongsTo(models.Publication, {
        foreignKey: 'publicationId',
        as: 'publication'
      })
    }
  }
  Comment.init({
    publicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Publication',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};