const {
	Card,
	CardAssignee,
	Checklist,
	Comment,
	User,
	BoardMember,
} = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName } = require("../helpers/enums");
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

	static async allCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});
			if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

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
					{ model: Checklist, order: [["position", "ASC"]] },
					{
						model: Comment,
						include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
					},
				],
			});
			if (!card) throw new AppError(errorName.NotFound, "Card not found");

			res.status(200).json({ card });
		} catch (error) {
			next(error);
		}
	}

	static async updateCard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId, cardId } = req.params;
			const {
				title,
				description,
				priority,
				dueDate,
				coverUrl,
				ListId,
				position,
			} = req.body;

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
				...(coverUrl !== undefined && { coverUrl }),
				...(ListId !== undefined && { ListId }),
				...(position !== undefined && { position }),
			});

			res.status(200).json({ message: "Card updated successfully", card });
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
				include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
			});

			res.status(201).json({
				message: "Comment created successfully",
				comment: commentWithUser,
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

			res.status(201).json({ message: "Checklist item created successfully" });
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

			res.status(200).json({ message: "Checklist updated successfully" });
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

			BoardRealtimeService.emitToBoard(req, boardId, "board:updated", {
				board,
			});

			res.status(200).json({ message: "Card deleted successfully" });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = CardController;
