const User = require("../models/user");
const mongoose = require("mongoose");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(error).send({ message: "Ошибка" }));
}

function getUser(req, res) {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) return res.send({ data: user });

      return res.status(error).send({ message: "Ошибка" });
    })
    .catch(() => res.status(error).send({ message: "Ошибка" }));
}

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(error).send({ message: "Ошибка" }));
}

function setInfo(req, res) {
  const { name, about } = req.body;
  const { id } = req.params;

  User.findByIdAndUpdate(
    id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    }
  ).then((user) => {});
}

function setAvatar(req, res) {
  const { avatar } = req.body;
  const { id } = req.params;

  User.findByIdAndUpdate(
    id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  ).then((user) => {});
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  setInfo,
  setAvatar,
};
