const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUser,
  setInfo,
  setAvatar,
} = require("../controllers/users");
const { regExp } = require("../constants/constants");

router.get("/", getUsers);
router.get('/me', getCurrentUser);

router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUser
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  setInfo
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regExp),
    }),
  }),
  setAvatar
);

module.exports = router;
