const router = require("express").Router();
const {
  getCard,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");
const { regExp } = require("../constants/constants");

router.get("/", getCard);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.required().string().regex(regExp),
    }),
  }),
  postCard
);

router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard
);

router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  putLike
);

router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteLike
);

module.exports = router;
