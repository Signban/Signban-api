"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Board extends Model {
		static associate(models) {
			Board.belongsTo(models.User, {
				foreignKey: "ownerId",
			});

			Board.hasMany(models.BoardMember, {
				foreignKey: "BoardId",
			});

			Board.hasMany(models.List, {
				foreignKey: "BoardId",
			});

			Board.hasMany(models.Card, {
				foreignKey: "BoardId",
			});

			Board.hasMany(models.Notification, {
				foreignKey: "BoardId",
			});
		}
	}

	Board.init(
		{
			name: {
				type: DataTypes.STRING(150),
				allowNull: false,
				validate: {
					notNull: { msg: "Board name is required" },
					notEmpty: { msg: "Board name is required" },
				},
			},
			description: DataTypes.TEXT,
			ownerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Board owner is required" },
				},
			},
		},
		{
			sequelize,
			modelName: "Board",
			tableName: "Boards",
		},
	);

	return Board;
};
