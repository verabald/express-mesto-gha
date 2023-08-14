const Card = require("../models/card");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
} = require("../status/status");

function getCard(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Ошибка на сервере" })
    );
}

function postCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CREATED).send({ data: card });
    })
    .catch((err) =>
      err.name === "ValidationError"
        ? res
            .status(ERROR_BAD_REQUEST)
            .send({ message: "Переданы некорректные данные" })
        : res
            .status(ERROR_INTERNAL_SERVER)
            .send({ message: "Ошибка на сервере" })
    );
}

function deleteCard(req, res) {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(new Error("NotFoundError"))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === "NotFoundError") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else if (err.name === "CastError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      } else {
        res
          .status(ERROR_INTERNAL_SERVER)
          .send({ message: "Ошибка на сервере" });
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

      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Передан несуществующий _id карточки" });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      }

      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка на сервере" });
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

      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Передан несуществующий _id карточки" });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      }

      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка на сервере" });
    });
}

module.exports = {
  getCard,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
