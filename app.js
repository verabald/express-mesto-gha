const express = require("express");
const mongoose = require("mongoose");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1/mestodb");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64d3ba6d78dfbcfa989cdc45'
  };

  next();
});

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.listen(PORT);
