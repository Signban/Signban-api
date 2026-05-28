const router = require("express").Router();
const authRoute = require("./auth");
const boardsRoute = require("./boards");
const cardRoute = require("./card");

router.use(authRoute);
router.use(boardsRoute);
router.use(cardRoute);

router.get("/", (req, res) => {
  res.status(200).json("home");
});

module.exports = router;
