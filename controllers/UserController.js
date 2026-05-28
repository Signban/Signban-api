const { User } = require("../models");
const { checkPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { errorName } = require("../helpers/enums");
const { AppError } = require("../models/utils/class");
const { OAuth2Client } = require("google-auth-library");

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const user = await User.create({ name, email, password });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  }

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

  static async getCurrentUser(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "name", "email", "avatarUrl"],
      });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { accessgoogle } = req.headers;

      if (!accessgoogle)
        throw new AppError(errorName.BadRequest, "Google token is required");

      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: accessgoogle,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
          password: Date.now().toString() + Math.random().toString(),
          avatarUrl: payload.picture || null,
        },
      });

      const access_token = signToken({ id: user.id, email: user.email });

      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
