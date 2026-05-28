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

class CardController {
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
          { model: User, as: "createdBy", attributes: ["id", "name", "email", "avatarUrl"] },
          {
            model: CardAssignee,
            include: [{ model: User, attributes: ["id", "name", "email", "avatarUrl"] }],
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
}

module.exports = CardController;
