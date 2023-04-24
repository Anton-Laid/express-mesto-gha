const { celebrate, Joi } = require("celebrate");
const { MSG_INVALID_LINK_FORMAT, LINK_PATTERN } = require("../utils/constants");
const validator = require("validator");

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LINK_PATTERN),
  }),
});

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(MSG_INVALID_LINK_FORMAT);
  }
  return value;
};
