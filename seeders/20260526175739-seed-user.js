"use strict";

const { hashPassword } = require("../helpers/bcrypt");

module.exports = {
	async up(queryInterface) {
		const now = new Date();

		await queryInterface.bulkInsert("Users", [
			{
				name: "Samsudin",
				email: "samsudin@signban.com",
				password: hashPassword("password123"),
				avatarUrl: null,
				resetPasswordToken: null,
				resetPasswordExpiredAt: null,
				createdAt: now,
				updatedAt: now,
			},
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("Users", {
			email: "samsudin@signban.com",
		});
	},
};
