"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("BoardMembers", {
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
			role: {
				allowNull: false,
				type: Sequelize.ENUM("owner", "member"),
				defaultValue: "member",
			},
			addedById: {
				type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			joinedAt: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn("NOW"),
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

		await queryInterface.addIndex("BoardMembers", ["BoardId", "UserId"], {
			unique: true,
			name: "board_members_board_id_user_id_unique",
		});
		await queryInterface.addIndex("BoardMembers", ["UserId"], {
			name: "board_members_user_id_idx",
		});
		await queryInterface.addIndex("BoardMembers", ["BoardId"], {
			name: "board_members_board_id_idx",
		});
		await queryInterface.addIndex("BoardMembers", ["addedById"], {
			name: "board_members_added_by_id_idx",
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable("BoardMembers");
		await queryInterface.sequelize.query(
			'DROP TYPE IF EXISTS "enum_BoardMembers_role";',
		);
	},
};
