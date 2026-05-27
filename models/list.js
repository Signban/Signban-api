"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    static associate(models) {
      List.belongsTo(models.Board, {
        foreignKey: "BoardId",
      });

      List.belongsTo(models.User, {
        foreignKey: "createdById",
      });

      List.hasMany(models.Card, {
        foreignKey: "ListId",
      });
    }
  }

  List.init(
    {
      BoardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Board is required" },
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: "List name is required" },
          notEmpty: { msg: "List name is required" },
        },
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "List position is required" },
          isInt: { msg: "List position must be an integer" },
        },
      },
      createdById: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "List",
      tableName: "Lists",
    },
  );

  return List;
};
