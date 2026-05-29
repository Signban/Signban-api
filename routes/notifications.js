const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const NotificationController = require("../controllers/NotificationController");

router.use(authentication);

router.get("/notifications", NotificationController.getMyNotifications);
router.patch(
  "/notifications/:notificationId/read",
  NotificationController.markAsRead,
);
router.patch("/notifications/read-all", NotificationController.markAllAsRead);

module.exports = router;
