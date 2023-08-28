const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUser,
  setInfo,
  setAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().length(24),
    }),
  }),
  getUser
);

router.patch("/me", setInfo);
router.patch("/me/avatar", setAvatar);

module.exports = router;
