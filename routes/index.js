const router = require("express").Router();
const authRoute = require("./auth");
const boardsRoute = require("./boards");
const listsRoute = require("./lists");
const cardRoute = require("./card");
const notificationRoute = require("./notifications");

router.use(authRoute);
router.use(boardsRoute);
router.use(listsRoute);
router.use(cardRoute);
router.use(notificationRoute);

router.get("/", (req, res) => {
  res.status(200).json("home");
});
9;
module.exports = router;
