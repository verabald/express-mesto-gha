const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Обязательное поле"],
    minlength: [2, "Текст должен быть длиннее 2 символов"],
    maxlength: [30, "Текст не может быть длиннее 30 символов"],
  },
  link: {
    type: String,
    required: [true, "Обязательное поле"],
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Некорректный URL",
    },
  },
  owner: {
    type: ObjectId,
    ref: "user",
    required: [true, "Обязательное поле"],
  },
  likes: [
    {
      type: ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model("card", cardSchema);
