const { User } = require("../models");
const { checkPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { errorName } = require("../helpers/enums");
const { AppError } = require("../models/utils/class");

class UserController {
	static async login(req, res, next) {
		try {
			const { email, password } = req.body;

			if (!email) throw new AppError(errorName.BadRequest, "email is required");
			if (!password)
				throw new AppError(errorName.BadRequest, "password is required");

			const user = await User.findOne({ where: { email } });
			if (!user)
				throw new AppError(errorName.Unauthorized, "invalid email/password");

			const isValid = checkPassword(password, user.password);
			if (!isValid)
				throw new AppError(errorName.Unauthorized, "invalid email/password");

			const access_token = signToken({
				id: user.id,
				email: user.email,
			});

			res.status(200).json({
				access_token,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = UserController;
