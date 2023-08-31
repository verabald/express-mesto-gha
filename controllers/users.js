const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../status/UnauthorizedError");
const NotFoundError = require("../status/NotFoundError");
const ConflictError = require("../status/ConflictError");
const BadRequestError = require("../status/BadRequestError");

const { STATUS_OK } = require("../status/status");

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError("Пользователь с указанным _id не найден"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
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
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.status(STATUS_OK).send({ token });
    })
    .catch(next);
}

function postUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(STATUS_OK).send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Пользователь существует"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Введены некорректные данные"));
      }
      return next(err);
    });
}

function setInfo(req, res, next) {
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
        next(new NotFoundError("Пользователь с указанным _id не найден"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
}

function setAvatar(req, res, next) {
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
      if (user) return res.send(user);

      throw new NotFoundError("Пользователь с указанным _id не найден");
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
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
