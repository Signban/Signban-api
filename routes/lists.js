const router = require("express").Router;
const authentication = require("../middlewares/authentication");
const ListController = require("../controllers/ListController");
const { route } = require("./boards");

router.use(authentication);

router.post("/boards/:boardId/lists", ListController.createList);
router.patch("/boards/:boardId/lists/reoder", ListController.reorderList);
router.patch("/boards/:boardId/lists/:listId", ListController.updateList);
router.delete("/boards/:boardId/lists/:listId", ListController.deleteList);

module.exports = router;
