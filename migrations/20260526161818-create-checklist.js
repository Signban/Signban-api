"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Checklists", {
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
      createdById: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      isCompleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAiGenerated: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      position: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      completedAt: {
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

    await queryInterface.addIndex("Checklists", ["CardId", "position"], {
      name: "checklists_card_id_position_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Checklists");
  },
};
