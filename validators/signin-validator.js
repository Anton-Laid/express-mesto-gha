const { celebrate, Joi } = require("celebrate");
const { LINK_PATTERN } = require("../utils/constants");

module.exports.signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LINK_PATTERN),
  }),
});
