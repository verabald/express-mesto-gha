const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");
const errorServer = require("../middlewares/errors");
const { STATUS_CREATED, ERROR_INTERNAL_SERVER } = require("../status/status");

function getCard(req, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function postCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new Error("NotFoundError"))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === "NotFoundError") {
        next(new NotFoundError("Карточка с указанным _id не найдена"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
}

function putLike(req, res) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      next(new NotFoundError("Передан несуществующий _id карточки"));
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      }

      next(err);
    });
}

function deleteLike(req, res) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) return res.send({ data: card });

      next(new NotFoundError("Передан несуществующий _id карточки"));
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      }

      next(err);
    });
}

module.exports = {
  getCard,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
