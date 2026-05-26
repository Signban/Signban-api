"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class CardAssignee extends Model {
		static associate(models) {
			CardAssignee.belongsTo(models.Card, {
				foreignKey: "CardId",
			});

			CardAssignee.belongsTo(models.User, {
				foreignKey: "UserId",
			});
			CardAssignee.belongsTo(models.User, {
				foreignKey: "assignedById",
				as: "assignedBy",
			});
		}
	}

	CardAssignee.init(
		{
			CardId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "Card is required" },
				},
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: { msg: "User is required" },
				},
			},
			assignedById: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "CardAssignee",
			tableName: "CardAssignees",
		},
	);

	return CardAssignee;
};
