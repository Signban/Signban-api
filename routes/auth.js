const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current-user", authentication, UserController.getCurrentUser);
router.get("/google-login", UserController.googleLogin);
router.patch("/account/name", authentication, UserController.updateName);
router.patch(
  "/account/password",
  authentication,
  UserController.updatePassword,
);

module.exports = router;
