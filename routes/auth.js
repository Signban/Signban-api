const UserController = require("../controllers/UserController");

const router = require("express").Router();

router.post("/login", UserController.login);

module.exports = router;
