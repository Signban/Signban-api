const router = require("express").Router();
const authentication = require("../middlewares/authentication");
const BoardController = require("../controllers/BoardController");
const BoardMemberController = require("../controllers/BoardMemberController");
const CardController = require("../controllers/CardsController");

router.use(authentication);

router.get("/boards", BoardController.getMyBoards);
router.post("/boards", BoardController.createBoard);
router.get("/boards/:boardId", BoardController.getBoardDetail);
router.patch("/boards/:boardId", BoardController.updateBoard);

router.get("/boards/:boardId/members", BoardMemberController.getMembers);
router.post("/boards/:boardId/members", BoardMemberController.addMember);
router.delete(
	"/boards/:boardId/members/:userId",
	BoardMemberController.removeMember,
);

router.post("/boards/:boardId/lists/:listId/cards", CardController.createCard);
router.patch("/boards/:boardId/cards/:cardId/move", CardController.moveCard);

module.exports = router;
