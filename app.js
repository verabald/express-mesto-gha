const express = require("express");
const mongoose = require("mongoose");
const routerUsers = require("./routes/users");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1/mestodb");

app.use(express.json());

app.use("/users", routerUsers);

app.listen(PORT);
