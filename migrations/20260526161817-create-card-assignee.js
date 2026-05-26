"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("CardAssignees", {
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
			assignedById: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
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

		await queryInterface.addIndex("CardAssignees", ["CardId", "UserId"], {
			unique: true,
			name: "card_assignees_card_id_user_id_unique",
		});
		await queryInterface.addIndex("CardAssignees", ["CardId"], {
			name: "card_assignees_card_id_idx",
		});
		await queryInterface.addIndex("CardAssignees", ["UserId"], {
			name: "card_assignees_user_id_idx",
		});
		await queryInterface.addIndex("CardAssignees", ["assignedById"], {
			name: "card_assignees_assigned_by_id_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("CardAssignees");
	},
};
