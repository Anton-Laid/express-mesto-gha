const { celebrate, Joi } = require("celebrate");
const { MSG_INVALID_LINK_FORMAT, LINK_PATTERN } = require("../utils/constants");
const validator = require("validator");

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(MSG_INVALID_LINK_FORMAT);
  }
  return value;
};

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
