'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type:Sequelize.INTEGER,
        References: {
          model:'Users',
          key:'id'
        },
        onDelete: 'CASCADE',
      },
      publicationId: {
        allowNull: false,
        type:Sequelize.INTEGER,
        References: {
          model:'Publications',
          key:'id'
        },
        onDelete: 'CASCADE',
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};