const router = require("express").Router();
const { getCard, postCard, deleteCard } = require("../controllers/cards");

router.get("/", getCard);
router.post("/", postCard);
router.delete("/:cardId", deleteCard);

module.exports = router;
