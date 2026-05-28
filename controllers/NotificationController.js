const { Notification } = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName } = require("../helpers/enums");

class NotificationController {
  static async getMyNotifications(req, res, next) {
    try {
      const userId = req.user.id;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const where = { UserId: userId };
      if (req.query.isRead !== undefined) {
        where.isRead = req.query.isRead === "true";
      }

      const { count, rows: notifications } = await Notification.findAndCountAll(
        { where, limit, offset, order: [["createdAt", "DESC"]] },
      );

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        notifications,
        meta: {
          page,
          limit,
          total: count,
          totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const { notificationId } = req.params;

      const findNotification = await Notification.findOne({
        where: { id: notificationId, UserId: userId },
      });
      if (!findNotification)
        throw new AppError(errorName.NotFound, "Notification not found");

      await findNotification.update({ isRead: true, readAt: new Date() });

      res
        .status(200)
        .json({ message: "Notification marked as read", findNotification });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;

      await Notification.update(
        { isRead: true, readAt: new Date() },
        { where: { UserId: userId, isRead: false } },
      );

      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
