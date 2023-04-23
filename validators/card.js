const { celebrate, Joi } = require("celebrate");
const { LINK_PATTERN } = require("../utils/constants");

module.exports.validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(LINK_PATTERN).required(),
  }),
});

module.exports.validateDataBaseId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});
