const router = require("express").Router();
const authRoute = require("./auth");
const boardsRoute = require("./boards");
const listsRoute = require("./lists");

router.use(authRoute);
router.use(boardsRoute);
router.use(listsRoute);

router.get("/", (req, res) => {
  res.status(200).json("home");
});
9;
module.exports = router;
