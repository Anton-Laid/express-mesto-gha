const User = require("../modules/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const errorList = require("../errors/index");
const {
  STATUS_OK,
  STATUS_CREATED,
  MSG_PROFILE_NOT_FOUND,
  MSG_USER_NOT_FOUND,
  MSG_INVALID_USER_DATA,
  MSG_USER_UNAUTHORIZED,
  CAST_ERROR,
  VALIDATION_ERROR,
} = require("../utils/constants");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(users);
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new errorList.NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        return next(new errorList.BadRequestError(MSG_USER_NOT_FOUND));
      }
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const users = req.user._id;

  User.findById(users)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => next(error));
};

const createUsers = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(STATUS_CREATED).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new errorList.ConflictError(MSG_REGISTERED_USER));
      }
      if (err.name === VALIDATION_ERROR) {
        return next(new errorList.BadRequestError(MSG_INVALID_USER_DATA));
      }
      return next(err);
    });
};

const updataUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new errorList.NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.status(STATUS_OK).send({ name: user.name, about: user.about });
    })
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        next(new errorList.BadRequestError(MSG_UPDATE_USERS_DATA));
      }
      next(error);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false }
  )
    .then((user) => {
      if (!user) {
        throw new errorList.NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return next(new errorList.BadRequestError(MSG_INVALID_USER_DATA));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "super-strong-secret", {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(() => next(new errorList.UnauthorizedError(MSG_USER_UNAUTHORIZED)));
};

module.exports = {
  getUsers,
  getUserId,
  getCurrentUser,
  createUsers,
  updataUser,
  updateAvatar,
  login,
};
