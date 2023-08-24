const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: [2, "Текст должен быть длиннее 2 символов"],
      maxlength: [30, "Текст не может быть длиннее 30 символов"],
    },
    about: {
      type: String,
      default: "Исследователь",
      minlength: [2, "Текст должен быть длиннее 2 символов"],
      maxlength: [30, "Текст не может быть длиннее 30 символов"],
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Некорректно указана почта",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
