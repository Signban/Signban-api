const router = require("express").Router();
const { sequelize } = require("../models");
const authRoute = require("./auth");
const boardsRoute = require("./boards");
const listsRoute = require("./lists");
const cardRoute = require("./card");
const notificationRoute = require("./notifications");

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.get("/health/db", async (req, res, next) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

router.use(authRoute);
router.use(boardsRoute);
router.use(listsRoute);
router.use(cardRoute);
router.use(notificationRoute);

router.get("/", (req, res) => {
  res.status(200).json("home");
});

module.exports = router;
