const { errorName } = require("../helpers/enums");
const { AppError } = require("../models/utils/class");

class ServiceExample {
	static async login(payload) {
		try {
			const { email, password } = payload;

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
			return access_token;
		} catch (error) {
			console.log(error);
		}
	}
}
