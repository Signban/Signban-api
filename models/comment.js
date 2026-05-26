"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		static associate(models) {
			Comment.belongsTo(models.Card, {
				foreignKey: "CardId",
			});

			Comment.belongsTo(models.User, {
				foreignKey: "UserId",
			});
		}
	}

	Comment.init(
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
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: { msg: "Comment content is required" },
					notEmpty: { msg: "Comment content is required" },
				},
			},
		},
		{
			sequelize,
			modelName: "Comment",
			tableName: "Comments",
		},
	);

	return Comment;
};
