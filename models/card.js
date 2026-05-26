"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Card extends Model {
		static associate(models) {
			Card.belongsTo(models.Board, {
				foreignKey: "BoardId",
			});

			Card.belongsTo(models.List, {
				foreignKey: "ListId",
			});

			Card.belongsTo(models.User, {
				foreignKey: "createdById",
			});

			Card.hasMany(models.CardAssignee, {
				foreignKey: "CardId",
			});

			Card.hasMany(models.Checklist, {
				foreignKey: "CardId",
			});

			Card.hasMany(models.Comment, {
				foreignKey: "CardId",
			});

			Card.hasMany(models.Notification, {
				foreignKey: "CardId",
			});
		}
	}

	Card.init(
		{
			BoardId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Board is required" },
				},
			},
			ListId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "List is required" },
				},
			},
			createdById: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Card creator is required" },
				},
			},
			coverUrl: DataTypes.TEXT,
			title: {
				type: DataTypes.STRING(200),
				allowNull: false,
				validate: {
					notNull: { msg: "Card title is required" },
					notEmpty: { msg: "Card title is required" },
				},
			},
			description: DataTypes.TEXT,
			priority: {
				type: DataTypes.ENUM("low", "medium", "high", "urgent"),
				allowNull: false,
				defaultValue: "medium",
				validate: {
					isIn: {
						args: [["low", "medium", "high", "urgent"]],
						msg: "Card priority is invalid",
					},
				},
			},
			dueDate: DataTypes.DATE,
			position: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Card position is required" },
					isInt: { msg: "Card position must be an integer" },
				},
			},
		},
		{
			sequelize,
			modelName: "Card",
			tableName: "Cards",
		},
	);

	return Card;
};
