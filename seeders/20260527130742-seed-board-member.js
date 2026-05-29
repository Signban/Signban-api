"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("BoardMembers", [
      {
        BoardId: 1,
        UserId: 1,
        role: "owner",
        addedById: 1,
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        BoardId: 2,
        UserId: 1,
        role: "owner",
        addedById: 1,
        joinedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("BoardMembers", null, {});
  },
};
