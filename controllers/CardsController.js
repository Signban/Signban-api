const KanbanService = require("../services/KanbanService");
const BoardRealtimeService = require("../services/BoardRealtimeService");

class CardController {
	static async createCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, listId } = req.params;

			const card = await KanbanService.createCard(
				boardId,
				listId,
				userId,
				req.body,
			);

			const board = await KanbanService.getBoardDetail(boardId, userId);

			BoardRealtimeService.emitToBoard(req, boardId, "board:updated", {
				board,
			});

			res.status(201).json({
				message: "Card created successfully",
				card,
				board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async moveCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const board = await KanbanService.moveCard(
				boardId,
				cardId,
				userId,
				req.body,
			);

			BoardRealtimeService.emitToBoard(req, boardId, "card:moved", {
				board,
				cardId: Number(cardId),
				sourceListId: Number(req.body.sourceListId),
				destinationListId: Number(req.body.destinationListId),
				newPosition: Number(req.body.newPosition),
			});

			res.status(200).json({
				message: "Card moved successfully",
				board,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CardController;
