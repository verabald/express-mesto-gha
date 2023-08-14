const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Обязательное поле"],
    minlength: [2, "Текст должен быть длиннее 2 символов"],
    maxlength: [30, "Текст не может быть длиннее 30 символов"],
  },
  about: {
    type: String,
    required: [true, "Обязательное поле"],
    minlength: [2, "Текст должен быть длиннее 2 символов"],
    maxlength: [30, "Текст не может быть длиннее 30 символов"],
  },
  avatar: {
    type: String,
    required: [true, "Обязательное поле"],
  },
});

module.exports = mongoose.model("user", userSchema);
