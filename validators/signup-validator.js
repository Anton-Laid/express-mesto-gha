const { celebrate, Joi } = require("celebrate");
const { MSG_INVALID_LINK_FORMAT } = require("../utils/constants");
const validator = require("validator");

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(MSG_INVALID_LINK_FORMAT);
  }
  return value;
};

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
