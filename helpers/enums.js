const BoardMemberRole = Object.freeze({
  owner: "owner",
  member: "member",
});

const CardPriority = Object.freeze({
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
});

const NotificationType = Object.freeze({
  board_added: "board_added",
  card_assigned: "card_assigned",
});

const statusCode = Object.freeze({
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  SequelizeValidationError: 400,
  SequelizeUniqueConstraintError: 400,
  JsonWebTokenError: 401,
});

const errorName = Object.freeze({
  BadRequest: "BadRequest",
  Unauthorized: "Unauthorized",
  Forbidden: "Forbidden",
  NotFound: "NotFound",
  SequelizeValidationError: "SequelizeValidationError",
  SequelizeUniqueConstraintError: "SequelizeUniqueConstraintError",
  JsonWebTokenError: "JsonWebTokenError",
});

module.exports = {
  BoardMemberRole,
  CardPriority,
  NotificationType,
  statusCode,
  errorName,
};
