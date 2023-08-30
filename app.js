const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi } = require("celebrate");
const { regExp } = require("./constants/constants");

const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const auth = require("./middlewares/auth");
const errorServe = require("./middlewares/errors");

const { postUser, login } = require("./controllers/users");

const { ERROR_NOT_FOUND } = require("./status/status");

const { PORT = 3000, URL = "mongodb://127.0.0.1/mestodb" } = process.env;

const app = express();

require("dotenv").config();

mongoose.connect(URL);

app.use(express.json());

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regExp),
    }),
  }),
  postUser
);

app.use(auth);

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.use(errorServer);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: "Такой страницы не существует" });
});

app.listen(PORT);
