"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Cards", {
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
			ListId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Lists",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			createdById: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "RESTRICT",
			},
			coverUrl: {
				type: Sequelize.TEXT,
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING(200),
			},
			description: {
				type: Sequelize.TEXT,
			},
			priority: {
				allowNull: false,
				type: Sequelize.ENUM("low", "medium", "high", "urgent"),
				defaultValue: "medium",
			},
			dueDate: {
				type: Sequelize.DATE,
			},
			position: {
				allowNull: false,
				type: Sequelize.INTEGER,
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

		await queryInterface.addIndex("Cards", ["BoardId"], {
			name: "cards_board_id_idx",
		});
		await queryInterface.addIndex("Cards", ["ListId", "position"], {
			name: "cards_list_id_position_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Cards");
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_Cards_priority";',
		);
	},
};
