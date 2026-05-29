"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BoardMember extends Model {
    static associate(models) {
      BoardMember.belongsTo(models.Board, {
        foreignKey: "BoardId",
      });

      BoardMember.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      BoardMember.belongsTo(models.User, {
        foreignKey: "addedById",
        as: "addedBy",
      });
    }
  }

  BoardMember.init(
    {
      BoardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Board is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required" },
        },
      },
      role: {
        type: DataTypes.ENUM("owner", "member"),
        allowNull: false,
        defaultValue: "member",
        validate: {
          isIn: {
            args: [["owner", "member"]],
            msg: "Board member role is invalid",
          },
        },
      },
      addedById: DataTypes.INTEGER,
      joinedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BoardMember",
      tableName: "BoardMembers",
    },
  );

  return BoardMember;
};
