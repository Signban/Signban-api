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

	static async updateCardCover(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			if (!req.file) {
				throw new AppError(errorName.BadRequest, "Cover image is required");
			}

			const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
				folder: "Signban/cards",
				public_id: `Signban-Card-${cardId}-Cover`,
			});

			await card.update({ coverUrl: uploadResult.secure_url });

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"card:updated",
			);

			res.status(200).json({
				message: "Card cover updated successfully",
				card: realtime.card,
				board: realtime.board,
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

	static async createComment(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;
			const { content } = req.body;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			const comment = await Comment.create({
				CardId: cardId,
				UserId: userId,
				content,
			});
			const commentWithUser = await Comment.findByPk(comment.id, {
				include: [
					{ model: User, attributes: ["id", "name", "email", "avatarUrl"] },
				],
			});

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"comment:created",
				{ comment: commentWithUser },
			);

			res.status(201).json({
				message: "Comment created successfully",
				comment: commentWithUser,
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async createChecklist(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;
			const { title } = req.body;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			const count = await Checklist.count({ where: { CardId: cardId } });
			const checklist = await Checklist.create({
				CardId: cardId,
				createdById: userId,
				title,
				isCompleted: false,
				position: count,
			});

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"checklist:created",
				{ checklist },
			);

			res.status(201).json({
				message: "Checklist item created successfully",
				checklist,
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async updateChecklist(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId, checklistId } = req.params;
			const { title, isCompleted } = req.body;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const checklist = await Checklist.findOne({
				where: { id: checklistId, CardId: cardId },
			});
			if (!checklist)
				throw new AppError(errorName.NotFound, "Checklist item not found");

			await checklist.update({
				...(title !== undefined && { title }),
				...(isCompleted !== undefined && {
					isCompleted,
					completedAt: isCompleted ? new Date() : null,
				}),
			});

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"checklist:updated",
				{ checklist },
			);

			res.status(200).json({
				message: "Checklist updated successfully",
				checklist,
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async addAssignee(req, res, next) {
		try {
			const assignedById = req.user.id;
			const { boardId, cardId } = req.params;
			const { userId } = req.body;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: assignedById },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const targetMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!targetMember)
				throw new AppError(errorName.NotFound, "User is not a board member");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			const existing = await CardAssignee.findOne({
				where: { CardId: cardId, UserId: userId },
			});
			if (existing)
				throw new AppError(errorName.BadRequest, "User is already assigned");

			const assignee = await CardAssignee.create({
				CardId: cardId,
				UserId: userId,
				assignedById,
			});

			const notification = await Notification.create({
				ActorId: assignedById,
				UserId: userId,
				BoardId: boardId,
				CardId: cardId,
				type: NotificationType.card_assigned,
				title: "Added to card",
				message: `You are added to card ${card.title}`,
			});

			NotificationRealtimeService.emitToUser(req, userId, notification);

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				assignedById,
				"card:assigned",
				{ assignee, userId: Number(userId) },
			);

			res.status(201).json({
				message: "Assignee added successfully",
				assignee,
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async removeAssignee(req, res, next) {
		try {
			const requesterId = req.user.id;
			const { boardId, cardId, userId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: requesterId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const assignee = await CardAssignee.findOne({
				where: { CardId: cardId, UserId: userId },
			});
			if (!assignee)
				throw new AppError(errorName.NotFound, "Assignee not found");

			await assignee.destroy();

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				requesterId,
				"card:unassigned",
				{ userId: Number(userId) },
			);

			res.status(200).json({
				message: "Assignee removed successfully",
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async delChecklist(req, res, next) {
		try {
			const requesterId = req.user.id;
			const { boardId, cardId, checklistId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: requesterId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const checklist = await Checklist.findOne({
				where: { id: checklistId, CardId: cardId },
			});
			if (!checklist)
				throw new AppError(errorName.NotFound, "Checklist not found");

			await checklist.destroy();

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				requesterId,
				"checklist:deleted",
				{ checklistId: Number(checklistId) },
			);

			res.status(200).json({
				message: "Checklist item deleted successfully",
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}

	static async delCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});

			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const findCard = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!findCard) throw new AppError(errorName.NotFound, "Card not found");

			await findCard.destroy();

			const board = await KanbanService.getBoardDetail(boardId, userId);

			BoardRealtimeService.emitToBoard(req, boardId, "card:deleted", {
				board,
				cardId: Number(cardId),
			});

			res.status(200).json({ message: "Card deleted successfully", board });
		} catch (error) {
			next(error);
		}
	}

	static async generateWithAI(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

			const card = await Card.findOne({
				where: { id: cardId, BoardId: boardId },
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			const resAI = await generateAiChecklist({
				cardTitle: card.title,
				cardDescription: card.description,
				dueDate: card.dueDate,
			});

			await card.update({
				priority: resAI.priority,
				dueDate: resAI.dueDate,
			});

			const checklists = await Checklist.bulkCreate(
				resAI.checklists.map((item) => ({
					CardId: parseInt(cardId),
					createdById: userId,
					title: item.title,
					position: item.position,
					isAiGenerated: true,
					isCompleted: false,
				})),
			);

			const realtime = await CardController.emitCardRealtime(
				req,
				boardId,
				cardId,
				userId,
				"checklist:created",
				{ checklists, aiGenerated: true },
			);

			res.status(201).json({
				message: "AI checklist generated successfully",
				checklists: realtime.card.Checklists || checklists,
				card: realtime.card,
				board: realtime.board,
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CardController;
