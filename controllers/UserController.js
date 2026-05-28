const { User } = require("../models");
const { checkPassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { errorName } = require("../helpers/enums");
const { AppError } = require("../models/utils/class");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const { sendMail } = require("../helpers/mailer");

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

      if (!email) throw new AppError(errorName.BadRequest, "Email is required");
      if (!password)
        throw new AppError(errorName.BadRequest, "Password is required");

      const user = await User.findOne({ where: { email } });
      if (!user)
        throw new AppError(errorName.Unauthorized, "Invalid email/password");

      const isValid = checkPassword(password, user.password);
      if (!isValid)
        throw new AppError(errorName.Unauthorized, "Invalid email/password");

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

  static async updateName(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) throw new AppError(errorName.BadRequest, "Name is required");

      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw new AppError(errorName.NotFound, "User not found");
      }

      await user.update({ name });

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword)
        throw new AppError(errorName.BadRequest, "Old Password is required");

      if (!newPassword)
        throw new AppError(errorName.BadRequest, "New Password is required");

      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw new AppError(errorName.NotFound, "User not found");
      }

      const isValid = checkPassword(oldPassword, user.password);

      if (!isValid)
        throw new AppError(errorName.Unauthorized, "Old password is incorrect");

      await user.update({ password: newPassword });

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) throw new AppError(errorName.BadRequest, "Email is required");

      const user = await User.findOne({ where: { email } });
      if (!user) throw new AppError(errorName.NotFound, "User not found");

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordExpiredAt = new Date(Date.now() + 15 * 60 * 1000);

      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpiredAt,
      });

      const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      await sendMail({
        to: user.email,
        subject: "Reset Password Signban",
        html: `
        <h2>Reset Password</h2>
				<p>Click the link below to reset your password:</p>
				<a href="${resetLink}">${resetLink}</a>
				<p>This link will expire in 15 minutes.</p>
      `,
      });

      res
        .status(200)
        .json({ message: "Reset password link has been sent to your email" });
    } catch (error) {
      next(error);
    }
  }

  static async checkResetPasswordToken(req, res, next) {
    try {
      const { token } = req.body;
      if (!token) throw new AppError(errorName.BadRequest, "Token is required");

      const user = await User.findOne({ where: { resetPasswordToken: token } });

      if (
        !user ||
        !user.resetPasswordExpiredAt ||
        user.resetPasswordExpiredAt < new Date()
      )
        throw new AppError(
          errorName.Unauthorized,
          "Invalid or expired reset password token",
        );

      res.status(200).json({ message: "Reset password token is valid" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token) throw new AppError(errorName.BadRequest, "Token is required");

      if (!newPassword)
        throw new AppError(errorName.BadRequest, "New Password is required");

      const user = await User.findOne({ where: { resetPasswordToken: token } });

      if (
        !user ||
        !user.resetPasswordExpiredAt ||
        user.resetPasswordExpiredAt < new Date()
      )
        throw new AppError(
          errorName.Unauthorized,
          "Invalid or expired reset password token",
        );

      await user.update({
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpiredAt: null,
      });

      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
