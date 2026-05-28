const {
	sequelize,
	Board,
	BoardMember,
	List,
	Card,
	CardAssignee,
	Checklist,
	Comment,
	User,
} = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName } = require("../helpers/enums");

class KanbanService {
	static async checkBoardMember(boardId, userId, transaction = null) {
		const board = await Board.findByPk(boardId, { transaction });

		if (!board) {
			throw new AppError(errorName.NotFound, "Board not found");
		}

		const member = await BoardMember.findOne({
			where: {
				BoardId: boardId,
				UserId: userId,
			},
			transaction,
		});

		if (!member) {
			throw new AppError(errorName.Forbidden, "Access denied");
		}

		return { board, member };
	}

	static async getBoardDetail(boardId, userId) {
		await this.checkBoardMember(boardId, userId);

		const board = await Board.findByPk(boardId, {
			include: [
				{
					model: List,
					include: [
						{
							model: Card,
							include: [
								{
									model: CardAssignee,
									include: [
										{
											model: User,
											attributes: ["id", "name", "email", "avatarUrl"],
										},
									],
								},
								{ model: Checklist },
								{ model: Comment },
							],
						},
					],
				},
				{
					model: BoardMember,
					include: [
						{
							model: User,
							attributes: ["id", "name", "email", "avatarUrl"],
						},
					],
				},
			],
			order: [
				[List, "position", "ASC"],
				[List, Card, "position", "ASC"],
				[List, Card, Checklist, "position", "ASC"],
			],
		});

		if (!board) {
			throw new AppError(errorName.NotFound, "Board not found");
		}

		return board;
	}

	static async createList(boardId, userId, payload) {
		return await sequelize.transaction(async (transaction) => {
			await this.checkBoardMember(boardId, userId, transaction);

			const { name } = payload;

			if (!name) {
				throw new AppError(errorName.BadRequest, "List name is required");
			}

			const maxPositionList = await List.findOne({
				where: { BoardId: boardId },
				order: [["position", "DESC"]],
				transaction,
			});

			const position = maxPositionList ? maxPositionList.position + 1 : 1;

			const list = await List.create(
				{
					BoardId: Number(boardId),
					name,
					position,
					createdById: userId,
				},
				{ transaction },
			);

			return list;
		});
	}

	static async moveList(boardId, listId, userId, newPosition) {
		await sequelize.transaction(async (transaction) => {
			await this.checkBoardMember(boardId, userId, transaction);

			const targetList = await List.findOne({
				where: {
					id: listId,
					BoardId: boardId,
				},
				transaction,
			});

			if (!targetList) {
				throw new AppError(errorName.NotFound, "List not found");
			}

			const lists = await List.findAll({
				where: { BoardId: boardId },
				order: [["position", "ASC"]],
				transaction,
			});

			const filteredLists = lists.filter((list) => list.id !== Number(listId));

			const safePosition = Math.max(
				0,
				Math.min(Number(newPosition), filteredLists.length),
			);

			filteredLists.splice(safePosition, 0, targetList);

			await Promise.all(
				filteredLists.map((list, index) =>
					list.update({ position: index + 1 }, { transaction }),
				),
			);
		});
	}

	static async createCard(boardId, listId, userId, payload) {
		return await sequelize.transaction(async (transaction) => {
			await this.checkBoardMember(boardId, userId, transaction);

			const list = await List.findOne({
				where: {
					id: listId,
					BoardId: boardId,
				},
				transaction,
			});

			if (!list) {
				throw new AppError(errorName.NotFound, "List not found");
			}

			const { title, description, priority, dueDate } = payload;

			if (!title) {
				throw new AppError(errorName.BadRequest, "Card title is required");
			}

			const maxPositionCard = await Card.findOne({
				where: {
					BoardId: boardId,
					ListId: listId,
				},
				order: [["position", "DESC"]],
				transaction,
			});

			const position = maxPositionCard ? maxPositionCard.position + 1 : 1;

			const card = await Card.create(
				{
					BoardId: Number(boardId),
					ListId: Number(listId),
					createdById: userId,
					title,
					description,
					priority: priority || "medium",
					dueDate: dueDate || null,
					position,
				},
				{ transaction },
			);

			return card;
		});
	}

	static async moveCard(boardId, cardId, userId, payload) {
		await sequelize.transaction(async (transaction) => {
			await this.checkBoardMember(boardId, userId, transaction);

			const { sourceListId, destinationListId, newPosition } = payload;

			if (!destinationListId && destinationListId !== 0) {
				throw new AppError(
					errorName.BadRequest,
					"Destination list is required",
				);
			}

			const card = await Card.findOne({
				where: {
					id: cardId,
					BoardId: boardId,
				},
				transaction,
			});

			if (!card) {
				throw new AppError(errorName.NotFound, "Card not found");
			}

			const destinationList = await List.findOne({
				where: {
					id: destinationListId,
					BoardId: boardId,
				},
				transaction,
			});

			if (!destinationList) {
				throw new AppError(errorName.NotFound, "Destination list not found");
			}

			const oldListId = Number(sourceListId || card.ListId);
			const nextListId = Number(destinationListId);

			await card.update(
				{
					ListId: nextListId,
				},
				{ transaction },
			);

			const affectedListIds = [...new Set([oldListId, nextListId])];

			for (const currentListId of affectedListIds) {
				let cards = await Card.findAll({
					where: {
						BoardId: boardId,
						ListId: currentListId,
					},
					order: [["position", "ASC"]],
					transaction,
				});

				if (currentListId === nextListId) {
					cards = cards.filter((item) => item.id !== Number(cardId));

					const safePosition = Math.max(
						0,
						Math.min(Number(newPosition), cards.length),
					);

					cards.splice(safePosition, 0, card);
				}

				await Promise.all(
					cards.map((item, index) =>
						item.update({ position: index + 1 }, { transaction }),
					),
				);
			}
		});
	}
}

module.exports = KanbanService;
