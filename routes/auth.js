const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

const router = require("express").Router();

router.post("/login", UserController.login);
router.get("/current-user", authentication, UserController.getCurrentUser);

module.exports = router;
