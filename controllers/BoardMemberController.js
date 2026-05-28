const { Op, where } = require("sequelize");
const {
  Board,
  BoardMember,
  User,
  Notification,
  Card,
  CardAssignee,
} = require("../models");
const { AppError } = require("../models/utils/class");
const {
  errorName,
  BoardMemberRole,
  NotificationType,
} = require("../helpers/enums");

class BoardMemberController {
  static async getMembers(req, res, next) {
    try {
      const userId = req.user.id;
      const { boardId } = req.params;

      const findMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!findMember) throw new AppError(errorName.Forbidden, "Access denied");

      const resMembers = await BoardMember.findAll({
        where: { BoardId: boardId },
        include: [
          { model: User, attributes: ["id", "name", "email", "avatarUrl"] },
        ],
      });

      res.status(200).json({ resMembers });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req, res, next) {
    try {
      const actorId = req.user.id;
      const { boardId } = req.params;
      const { email } = req.body;

      const findMember = await BoardMember.findOne({
        where: {
          BoardId: boardId,
          UserId: memberId,
          role: BoardMemberRole.owner,
        },
      });
      if (!findMember)
        throw new AppError(errorName.Forbidden, "Only owner can add member");

      const board = await Board.findByPk(boardId);
      if (!board) throw new AppError(errorName.NotFound, "Board not found");

      const findUser = await User.findOne({ where: { email } });
      if (!findUser) throw new AppError(errorName.NotFound, "User not found");

      const existMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: findUser.id },
      });
      if (existMember)
        throw new AppError(
          errorName.BadRequest,
          "This user is already a member of this board",
        );

      const member = await BoardMember.create({
        BoardId: parseInt(boardId),
        UserId: findUser.id,
        role: BoardMemberRole.member,
        addedById: memberId,
        joinedAt: new Date(),
      });

      const notification = await Notification.create({
        UserId: findUser.id,
        ActorId: actorId,
        BoardId: parseInt(boardId),
        CardId: null,
        type: NotificationType.board_added,
        title: "Added to board",
        message: `You have been added to board ${board.name}`,
        isRead: false,
      });

      res
        .status(201)
        .json({ message: "Member added successfully", member, notification });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req, res, next) {
    try {
      const actorId = req.user.id;
      const { boardId, userId } = req.params;

      const findMember = await BoardMember.findOne({
        where: {
          BoardId: boardId,
          UserId: memberId,
          role: BoardMemberRole.owner,
        },
      });
      if (!findMember)
        throw new AppError(errorName.Forbidden, "Only owner can remove member");

      const delMember = await BoardMember.findOne({
        where: { BoardId: boardId, UserId: userId },
      });
      if (!delMember)
        throw new AppError(errorName.NotFound, "Member not found");

      if (delMember.role === BoardMemberRole.owner)
        throw new AppError(errorName.Forbidden, "Cannot remove board owner");

      const boardCard = await Card.findAll({
        where: { BoardId: boardId },
        attributes: ["id"],
      });
      const cardId = boardCard.map((c) => c.id);

      if (cardId.length > 0) {
        await CardAssignee.destroy({
          where: { UserId: parseInt(userId), CardId: { [Op.in]: cardId } },
        });
      }

      await delMember.destroy();

      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BoardMemberController;
