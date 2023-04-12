const route = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require("../controllers/cards");

route.get("/", getCards);
route.post("/", createCard);
route.delete("/:cardId", deleteCard);
route.put("/:cardId/likes", addLikeCard);
route.delete("/:cardId/likes", removeLikeCard);

module.exports = route;
