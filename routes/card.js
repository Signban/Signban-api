const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const CardController = require("../controllers/CardController");

// router.use(authentication);

router.get("/boards/:boardId/cards/:cardId", CardController.allCard);

module.exports = router;
