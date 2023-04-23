const { celebrate, Joi } = require("celebrate");
const { OBJECT_ID_PATTERN, LINK_PATTERN } = require("../utils/constants");

module.exports.avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(LINK_PATTERN),
  }),
});

module.exports.userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().pattern(OBJECT_ID_PATTERN),
  }),
});

module.exports.profileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});
