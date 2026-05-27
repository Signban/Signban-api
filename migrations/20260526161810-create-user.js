"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(255),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      avatarUrl: {
        type: Sequelize.TEXT,
      },
      resetPasswordToken: {
        type: Sequelize.STRING(255),
      },
      resetPasswordExpiredAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("Users", ["resetPasswordToken"], {
      name: "users_reset_password_token_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
