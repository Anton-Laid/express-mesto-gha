const { celebrate, Joi } = require("celebrate");
const { LINK_PATTERN } = require("../utils/constants");

module.exports.signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(LINK_PATTERN),
  }),
});
