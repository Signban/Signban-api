const { Board, BoardMember, List, Card } = require("../models");
const { AppError } = require("../models/utils/class");
const { errorName } = require("../helpers/enums");

class ListController {
  static async createList(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId } = req.params;
      const { name, position } = req.body;

      const findMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

      const list = await List.create({
        BoardId: parseInt(boardId),
        name,
        position,
        createdById: userId,
      });

      //   const io = req.app.get("io");
      //   io.to(`board:${boardId}`).emit("list:created", { list });

      res.status(201).json({ message: "List created successfully", list });
    } catch (error) {
      next(error);
    }
  }

  static async updateList(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId, listId } = req.params;
      const { name } = req.body;

      const findMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

      const findList = await List.findOne({
        where: { id: listId, BoardId: boardId },
      });
      if (!findList) throw new AppError(errorName.NotFound, "List not found");

      await findList.update({ name });

      res.status(200).json({ message: "List updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async reorderList(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId } = req.params;
      const { lists } = req.body;

      const findMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

      await Promise.all(
        lists.map((item) =>
          List.update(
            { position: item.position },
            { where: { id: item.id, BoardId: boardId } },
          ),
        ),
      );

      res.status(200).json({ message: "Lists reordered successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteList(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId, listId } = req.params;

      const findMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

      const findList = await List.findOne({
        where: { id: listId, BoardId: boardId },
      });
      if (!findList) throw new AppError(errorName.NotFound, "List not found");

      const resCard = await Card.count({ where: { ListId: listId } });
      if (resCard > 0)
        throw new AppError(
          errorName.BadRequest,
          "Cannot delete list that still has cards",
        );

      await findList.destroy();

      res.status(200).json({ message: "List deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ListController;
