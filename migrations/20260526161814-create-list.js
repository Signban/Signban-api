"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Lists", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			BoardId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Boards",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING(100),
			},
			position: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			createdById: {
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

		await queryInterface.addIndex("Lists", ["BoardId", "position"], {
			name: "lists_board_id_position_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Lists");
	},
};
