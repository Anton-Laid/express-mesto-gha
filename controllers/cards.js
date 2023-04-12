const Card = require("../modules/card");
const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_DEFAULT,
} = require("../errors/errors");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const createCard = (req, res) => {
  const data = new Date();
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        createdAt: data,
      });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Данные введены не корректно" });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  Card.findOneAndDelete(cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(card);

        return;
      }
      res
        .status(ERR_NOT_FOUND)
        .send({ message: "Карточка c таким id не найдена" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Карточка не найдена" });
      }
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const addLikeCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(ERROR).send({ message: "Некорректный _id" });
      }
      return res
        .status(ERROR_DEFAULT)
        .send({ message: "На сервере произошла ошибка" });
    });
};

const removeLikeCard = (req, res) => {
  Card.findOneAndDelete(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.status(200).send(card);
      }
      return res
        .status(ERR_NOT_FOUND)
        .send({ message: "Карточка c таким id не найдена" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ message: "Карточка не найдена" });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
