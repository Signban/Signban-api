"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Boards", [
      {
        name: "Final Project",
        description: "Board untuk tracking final project",
        ownerId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Sprint Planning",
        description: "Board untuk sprint planning tim",
        ownerId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Boards", null, {});
  },
};
