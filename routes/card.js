const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const CardController = require("../controllers/CardController");

router.use(authentication);

router.get("/boards/:boardId/cards/:cardId", CardController.allCard);
router.put("/boards/:boardId/cards/:cardId", CardController.updateCard);
router.post("/boards/:boardId/lists/:listId/cards", CardController.createCard);
router.patch("/boards/:boardId/cards/:cardId/move", CardController.moveCard);
router.delete("/boards/:boardId/cards/:cardId", CardController.delCard);
router.post(
  "/boards/:boardId/cards/:cardId/comments",
  CardController.createComment,
);
router.post(
  "/boards/:boardId/cards/:cardId/checklists/ai-generate",
  CardController.generateWithAI,
);
router.post(
  "/boards/:boardId/cards/:cardId/checklists",
  CardController.createChecklist,
);
router.patch(
  "/boards/:boardId/cards/:cardId/checklists/:checklistId",
  CardController.updateChecklist,
);

module.exports = router;
