"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Checklist extends Model {
		static associate(models) {
			Checklist.belongsTo(models.Card, {
				foreignKey: "CardId",
			});

			Checklist.belongsTo(models.User, {
				foreignKey: "createdById",
			});
		}
	}

	Checklist.init(
		{
			CardId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Card is required" },
				},
			},
			createdById: DataTypes.INTEGER,
			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
				validate: {
					notNull: { msg: "Checklist title is required" },
					notEmpty: { msg: "Checklist title is required" },
				},
			},
			isCompleted: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			isAiGenerated: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			position: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Checklist position is required" },
					isInt: { msg: "Checklist position must be an integer" },
				},
			},
			completedAt: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Checklist",
			tableName: "Checklists",
		},
	);

	return Checklist;
};
