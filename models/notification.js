"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      Notification.belongsTo(models.User, {
        foreignKey: "ActorId",
        as: "actor",
      });

      Notification.belongsTo(models.Board, {
        foreignKey: "BoardId",
      });

      Notification.belongsTo(models.Card, {
        foreignKey: "CardId",
      });
    }
  }

  Notification.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Notification recipient is required" },
        },
      },
      ActorId: DataTypes.INTEGER,
      BoardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Board is required" },
        },
      },
      CardId: DataTypes.INTEGER,
      type: {
        type: DataTypes.ENUM("board_added", "card_assigned"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["board_added", "card_assigned"]],
            msg: "Notification type is invalid",
          },
        },
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notNull: { msg: "Notification title is required" },
          notEmpty: { msg: "Notification title is required" },
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Notification message is required" },
          notEmpty: { msg: "Notification message is required" },
        },
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
    },
  );

  return Notification;
};
