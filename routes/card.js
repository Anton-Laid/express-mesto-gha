const route = require("express").Router();
const {
  createCard,
  getCards,
  deleteCard,
  addLikeCard,
  removeLikeCard,
} = require("../controllers/cards");
const { validateCardInfo, validateDataBaseId } = require("../validators/card");

route.get("/", getCards);

route.post("/", validateCardInfo, createCard);

route.delete("/:cardId", validateDataBaseId, deleteCard);

route.put("/:cardId/likes", validateDataBaseId, addLikeCard);

route.delete("/:cardId/likes", validateDataBaseId, removeLikeCard);

module.exports = route;
