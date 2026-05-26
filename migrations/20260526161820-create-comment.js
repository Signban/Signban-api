"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Comments", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			CardId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Cards",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			UserId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			content: {
				allowNull: false,
				type: Sequelize.TEXT,
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

		await queryInterface.addIndex("Comments", ["CardId"], {
			name: "comments_card_id_idx",
		});
		await queryInterface.addIndex("Comments", ["UserId"], {
			name: "comments_user_id_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Comments");
	},
};
