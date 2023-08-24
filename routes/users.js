const router = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
  setInfo,
  setAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.patch("/me", setInfo);
router.patch("/me/avatar", setAvatar);

module.exports = router;
