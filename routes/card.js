const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const CardController = require("../controllers/CardController");

router.use(authentication);

router.get("/boards/:boardId/cards/:cardId", CardController.allCard);
router.put("/boards/:boardId/cards/:cardId", CardController.updateCard);
router.post("/boards/:boardId/lists/:listId/cards", CardController.createCard);
router.patch("/boards/:boardId/cards/:cardId/move", CardController.moveCard);
router.delete("/boards/:boardId/cards/:cardId", CardController.delCard);

module.exports = router;
