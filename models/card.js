const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: ({ length }) => length >= 2 && length <= 30,
      message: "Название карточки должно быть от 2 до 30 символов",
    },
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    ref: "user",
    required: true,
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
});

module.exports = mongoose.model("card", cardSchema);
