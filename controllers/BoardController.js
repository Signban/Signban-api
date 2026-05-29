const { Op } = require("sequelize");
const {
	Board,
	BoardMember,
	List,
	Card,
	CardAssignee,
	Checklist,
	Comment,
	User,
	sequelize,
} = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName, BoardMemberRole } = require("../helpers/enums");
const { generateAiBoardLists } = require("../helpers/gemini");

class BoardController {
	static async getMyBoards(req, res, next) {
		try {
			const userId = req.user.id;

			const resMember = await BoardMember.findAll({
				where: { UserId: userId },
				attributes: ["BoardId"],
			});

			const boardId = resMember.map((m) => m.BoardId);

			const boards = await Board.findAll({
				where: { id: { [Op.in]: boardId } },
				include: [
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
				order: [["updatedAt", "DESC"]],
			});

			res.status(200).json({ boards });
		} catch (error) {
			next(error);
		}
	}

	static async createBoard(req, res, next) {
		const transaction = await sequelize.transaction();

		try {
			const userId = req.user.id;
			const { name, description, generatedListWithAi } = req.body;

			const board = await Board.create(
				{
					name,
					description,
					ownerId: userId,
				},
				{ transaction },
			);

			await BoardMember.create(
				{
					BoardId: board.id,
					UserId: userId,
					role: BoardMemberRole.owner,
					addedById: userId,
					joinedAt: new Date(),
				},
				{ transaction },
			);

			let createdLists = [];

			const shouldGenerateListWithAi =
				generatedListWithAi === true || generatedListWithAi === "true";

			if (shouldGenerateListWithAi) {
				const aiLists = await generateAiBoardLists(name, description);

				if (aiLists.length > 0) {
					createdLists = await List.bulkCreate(
						aiLists.map((list, index) => ({
							name: list.name,
							position: list.position || index + 1,
							BoardId: board.id,
						})),
						{
							transaction,
							returning: true,
						},
					);
				}
			}

			await transaction.commit();

			res.status(201).json({
				message: "Board created successfully",
				board,
				lists: createdLists,
			});
		} catch (error) {
			await transaction.rollback();
			next(error);
		}
	}

	static async getBoardDetail(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId } = req.params;

			const findMember = await BoardMember.findOne({
				where: { BoardId: boardId, UserId: userId },
			});

			if (!findMember) {
				throw new AppError(errorName.Forbidden, "Access denied");
			}

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

			res.status(200).json({ board });
		} catch (error) {
			next(error);
		}
	}

	static async updateBoard(req, res, next) {
		try {
			const userId = req.user.id;
			const { boardId } = req.params;
			const { name, description } = req.body;

			const board = await Board.findByPk(boardId);

			if (!board) {
				throw new AppError(errorName.NotFound, "Board not found");
			}

			const findMember = await BoardMember.findOne({
				where: {
					BoardId: boardId,
					UserId: userId,
					role: BoardMemberRole.owner,
				},
			});

			if (!findMember) {
				throw new AppError(errorName.Forbidden, "Only owner can update board");
			}

			await board.update({ name, description });

			const io = req.app.get("io");

			if (io) {
				io.to(`board:${boardId}`).emit("board:updated", { board });
			}

			res.status(200).json({ message: "Board updated successfully", board });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = BoardController;
