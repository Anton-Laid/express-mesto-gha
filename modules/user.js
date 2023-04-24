const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const {
  MSG_USER_UNAUTHORIZED,
  MSG_INVALID_LINK_FORMAT,
  MSG_INVALID_MAIL_FORMAT,
} = require("../utils/constants");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(v) {
        return /(:?(?:https?:\/\/)?(?:www\.)?)?[-a-z0-9]+\.\w/gi.test(v);
      },
      message: MSG_INVALID_LINK_FORMAT,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: MSG_INVALID_MAIL_FORMAT,
    },
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject(new Error(MSG_USER_UNAUTHORIZED));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new Error(MSG_USER_UNAUTHORIZED));
      }

      return user;
    });
  });
};

module.exports = mongoose.model("user", userSchema);
