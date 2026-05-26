"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Notifications", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
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
			ActorId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
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
			CardId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Cards",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			type: {
				allowNull: false,
				type: Sequelize.ENUM("board_added", "card_assigned"),
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING(200),
			},
			message: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			isRead: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			},
			readAt: {
				type: Sequelize.DATE,
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

		await queryInterface.addIndex("Notifications", ["UserId"], {
			name: "notifications_user_id_idx",
		});
		await queryInterface.addIndex("Notifications", ["UserId", "isRead"], {
			name: "notifications_user_id_is_read_idx",
		});
		await queryInterface.addIndex("Notifications", ["type"], {
			name: "notifications_type_idx",
		});
		await queryInterface.addIndex("Notifications", ["BoardId"], {
			name: "notifications_board_id_idx",
		});
		await queryInterface.addIndex("Notifications", ["CardId"], {
			name: "notifications_card_id_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("Notifications");
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_Notifications_type";',
		);
	},
};
