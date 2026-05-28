const {
	Card,
	CardAssignee,
	Checklist,
	Comment,
	User,
	BoardMember,
	Notification,
} = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName, NotificationType } = require("../helpers/enums");
const KanbanService = require("../services/KanbanService");
const BoardRealtimeService = require("../services/BoardRealtimeService");
const { generateAiChecklist } = require("../helpers/gemini");
const NotificationRealtimeService = require("../services/NotificationRealtimeService");
const { uploadBufferToCloudinary } = require("../helpers/cloudinary");

class CardController {
	static sortCardChildren(card) {
		if (!card) return card;

		const plainCard = card.toJSON ? card.toJSON() : card;

		return {
			...plainCard,
			Checklists: [...(plainCard.Checklists || [])].sort(
				(a, b) => (a.position || 0) - (b.position || 0),
			),
			Comments: [...(plainCard.Comments || [])].sort(
				(a, b) => new Date(a.createdAt) - new Date(b.createdAt),
			),
		};
	}

	static async getCardDetail(boardId, cardId) {
		const card = await Card.findOne({
			where: { id: cardId, BoardId: boardId },
			include: [
				{ model: User, attributes: ["id", "name", "email", "avatarUrl"] },
				{
					model: CardAssignee,
					include: [
						{ model: User, attributes: ["id", "name", "email", "avatarUrl"] },
					],
				},
				{ model: Checklist },
				{
					model: Comment,
					include: [
						{ model: User, attributes: ["id", "name", "email", "avatarUrl"] },
					],
				},
			],
		});

		if (!card) throw new AppError(errorName.NotFound, "Card not found");

		return CardController.sortCardChildren(card);
	}

	static async emitCardRealtime(
		req,
		boardId,
		cardId,
		userId,
		eventName,
		payload = {},
	) {
		const [board, card] = await Promise.all([
			KanbanService.getBoardDetail(boardId, userId),
			CardController.getCardDetail(boardId, cardId),
		]);

		BoardRealtimeService.emitToBoard(req, boardId, eventName, {
			board,
			card,
			cardId: Number(cardId),
			...payload,
		});

		return { board, card };
	}

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

			BoardRealtimeService.emitToBoard(req, boardId, "card:created", {
				board,
				card,
				cardId: Number(card.id),
				listId: Number(listId),
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

	static async allCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await CardController.getCardDetail(boardId, cardId);

			res.status(200).json({ card });
		} catch (error) {
			next(error);
		}
	}

	static async updateCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;
			const { title, description, priority, dueDate, ListId, position } =
				req.body;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			await card.update({
				...(title !== undefined && { title }),
				...(description !== undefined && { description }),
				...(priority !== undefined && { priority }),
				...(dueDate !== undefined && { dueDate }),
				...(ListId !== undefined && { ListId }),
				...(position !== undefined && { position }),
			});

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"card:updated",
			);

			res.status(200).json({
				message: "Card updated successfully",
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CardController;
