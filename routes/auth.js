const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current-user", authentication, UserController.getCurrentUser);
router.get("/google-login", UserController.googleLogin);
<<<<<<< HEAD
router.post("/forgot-password", UserController.forgotPassword);
router.post(
  "/check-reset-password-token",
  UserController.checkResetPasswordToken,
);
router.post("/reset-password", UserController.resetPassword);
=======
router.patch("/account/name", authentication, UserController.updateName);
router.patch(
  "/account/password",
  authentication,
  UserController.updatePassword,
);
>>>>>>> 6497222a5e97d8415afe28578613fb232f6251c8

module.exports = router;
