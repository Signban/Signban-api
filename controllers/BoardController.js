const { Op, where } = require("sequelize");
const { Board, BoardMember, List, Card } = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName, BoardMemberRole } = require("../helpers/enums");

class BoardController {
  static async getMyBoards(req, res, next) {
    try {
      const userId = req.user.id;

      const member = await BoardMember.findAll({
        where: { UserId: userId },
        attributes: ["BoardId"],
      });
      const boardId = member.map((m) => m.BoardId);

      const boards = await Board.findAll({
        where: { id: { [Op.in]: boardId } },
        include: [{ model: BoardMember }],
      });

      res.status(200).json({ boards });
    } catch (error) {
      next(error);
    }
  }

  static async createBoard(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, description } = req.body;

      const board = await Board.create({ name, description, ownerId: userId });

      await BoardMember.create({
        BoardId: board.id,
        UserId: userId,
        role: BoardMemberRole.owner,
        addedById: userId,
        joinedAt: new Date(),
      });

      res.status(201).json({ message: "Board created successfully", board });
    } catch (error) {
      next(error);
    }
  }

  static async getBoardDetail(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId } = req.params;

      const member = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!member) throw new AppError(errorName.Forbidden, "Access denied");

      const board = await Board.findByPk(boardId, {
        include: [
          { model: List, include: [{ model: Card }] },
          { model: BoardMember },
        ],
      });
      if (!board) throw new AppError(errorName.NotFound, "Board not found");

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
      if (!board) throw new AppError(errorName.NotFound, "Board not found");

      const member = await BoardMember.findOne({
        where: {
          BoardId: boardId,
          UserId: userId,
          role: BoardMemberRole.owner,
        },
      });
      if (!member)
        throw new AppError(errorName.Forbidden, "Only owner can update board");

      await board.update({ name, description });

      //   const io = req.app.get("io");
      //   io.to(`board:${boardId}`).emit("board:updated", { board });

      res.status(200).json({ message: "Board updated successfully", board });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BoardController;
