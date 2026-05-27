const router = require("express").Router();
const authRoute = require("./auth");

router.use(authRoute);

router.get("/", (req, res) => {
  res.status(200).json("home");
});

module.exports = router;
