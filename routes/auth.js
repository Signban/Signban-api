const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current-user", authentication, UserController.getCurrentUser);
router.get("/google-login", UserController.googleLogin);
router.post("/forgot-password", UserController.forgotPassword);
router.post(
  "/check-reset-password-token",
  UserController.checkResetPasswordToken,
);
router.post("/reset-password", UserController.resetPassword);

module.exports = router;
