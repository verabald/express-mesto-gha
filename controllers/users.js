const User = require("../models/user");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
} = require("../status/status");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(ERROR_INTERNAL_SERVER).send({ message: "Ошибка на сервере" })
    );
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error("NotFoundError"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "NotFoundError") {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: "Пользователь с указанным _id не найден" });
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
};

function postUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send({ data: user });
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

function setInfo(req, res) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Пользователь с указанным _id не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      }

      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Пользователь с указанным _id не найден" });
      }

      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка на сервере" });
    });
}

function setAvatar(req, res) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      return res
        .status(ERROR_NOT_FOUND)
        .send({ message: "Пользователь с указанным _id не найден" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные" });
      }

      if (err.name === "CastError") {
        return res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Пользователь с указанным _id не найден" });
      }

      return res
        .status(ERROR_INTERNAL_SERVER)
        .send({ message: "Ошибка на сервере" });
    });
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  setInfo,
  setAvatar,
};
