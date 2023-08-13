const Card = require("../models/card");
const mongoose = require("mongoose");

function getCard(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Ошибка" }));
}

function postCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(console.log("Успешно"));
}

function deleteCard(req, res) {
  const { id } = req.params;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card) return res.send({ data: card });

      return res.status(error).send({ message: "Ошибка" });
    })
    .catch((err) =>
      err.name === "CastError"
        ? res.status(error).send({ message: "Ошибка" })
        : res.status(error).send({ message: "Ошибка" })
    );
}

function putLike(req, res) {
  const { idCard } = req.params;

  Card.findByIdAndUpdate(
    idCard,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  ).then((card) => {});
}

function deleteLike(req, res) {
  const { idCard } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  ).then((card) => {});
}

module.exports = {
  getCard,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
