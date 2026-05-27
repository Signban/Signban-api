"use strict";

const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Board, {
        foreignKey: "ownerId",
      });

      User.hasMany(models.BoardMember, {
        foreignKey: "UserId",
      });
      User.hasMany(models.BoardMember, {
        foreignKey: "addedById",
        as: "addedBy",
      });

      User.hasMany(models.List, {
        foreignKey: "createdById",
      });

      User.hasMany(models.Card, {
        foreignKey: "createdById",
      });

      User.hasMany(models.CardAssignee, {
        foreignKey: "UserId",
      });
      User.hasMany(models.CardAssignee, {
        foreignKey: "assignedById",
        as: "assignedBy",
      });

      User.hasMany(models.Checklist, {
        foreignKey: "createdById",
      });

      User.hasMany(models.Comment, {
        foreignKey: "UserId",
      });

      User.hasMany(models.Notification, {
        foreignKey: "UserId",
      });
      User.hasMany(models.Notification, {
        foreignKey: "ActorId",
        as: "Actor",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          msg: "Email must be unique",
        },
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Email format is invalid" },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
      avatarUrl: DataTypes.TEXT,
      resetPasswordToken: DataTypes.STRING(255),
      resetPasswordExpiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    },
  );

  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  });

  return User;
};
