const mongoose = require("mongoose");
const validator = require("validator");

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
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Некорректный URL",
    },
  },
}, { versionKey: false });

module.exports = mongoose.model("user", userSchema);
