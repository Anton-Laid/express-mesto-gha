const Card = require("../modules/card");
//const errorList = require("../errors/index");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const ForbiddenError = require("../errors/ForbiddenError");

const {
  STATUS_CREATED,
  VALIDATION_ERROR,
  MSG_INVALID_CARD_DATA,
  MSG_INCORRECT_DATA,
  CAST_ERROR,
  STATUS_OK,
} = require("../utils/constants");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((error) => {
      next(error);
    });
};

const createCard = (req, res, next) => {
  const data = new Date();
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CREATED).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
        createdAt: data,
      });
    })
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        return next(new BadRequestError(MSG_INCORRECT_DATA));
      }
      return next(error);
    });
};

const deleteCard = (req, res, next) => {
  const cardId = req.params.cardId;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(MSG_INVALID_CARD_DATA));
      } else if (card.owner.toString() === req.user._id) {
        Card.deleteOne({ _id: cardId }).then((card) => {
          res.status(STATUS_OK).send({ data: card });
        });
      } else {
        next(new ForbiddenError(MSG_NOT_YOUR_OWN_CARD));
      }
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        next(new BadRequestError(MSG_FORBIDDEN));
      }
      next(error);
    });
};

(req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MSG_INVALID_CARD_DATA);
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError(MSG_NOT_YOUR_OWN_CARD);
      } else {
        return Card.deleteOne(card).then(() =>
          res.status(STATUS_OK).send(MSG_NOT_YOUR_OWN_CARD)
        );
      }
    })
    .catch((err) => {
      if (err.name === ErrorTypes.CAST) {
        throw new BadRequestError(MSG_FORBIDDEN);
      }
      next(err);
    })
    .catch(next);
};

const addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MSG_INVALID_CARD_DATA);
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        next(new BadRequestError(MSG_INCORRECT_DATA));
      }
      next(error);
    });
};

const removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(MSG_INVALID_CARD_DATA);
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        return next(new BadRequestError(MSG_INCORRECT_DATA));
      }
      return next(error);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  removeLikeCard,
};
