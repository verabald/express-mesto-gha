const User = require("../models/user");
const bcrypt = require("bcrypt");
const { NODE_ENV, JWT_SECRET } = process.env;
const NotFoundError = require("../status/NotFoundError");
const ForbiddenError = require("../status/ForbiddenError");
const BadRequestError = require("../status/BadRequestError");

const { STATUS_CREATED } = require("../status/status");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error("NotFoundError"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "NotFoundError") {
        next(new NotFoundError("Пользователь с указанным _id не найдена"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.status(STATUS_CREATED).send({ token });
    })
    .catch(next);
}

function postUser(req, res) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(STATUS_CREATED).send({ name, about, avatar, email });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      }

      next(err);
    });
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
      if (err.message === "NotFoundError") {
        next(new NotFoundError("Пользователь с указанным _id не найдена"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
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
      if (err.message === "NotFoundError") {
        next(new NotFoundError("Пользователь с указанным _id не найдена"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  setInfo,
  setAvatar,
  login,
};
