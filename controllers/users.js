const User = require("../modules/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  STATUS_CREATED,
  MSG_PROFILE_NOT_FOUND,
  MSG_USER_NOT_FOUND,
  MSG_INVALID_USER_DATA,
  MSG_USER_UNAUTHORIZED,
  CAST_ERROR,
  VALIDATION_ERROR,
  STATUS_OK,
} = require("../utils/constants");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_OK).send(
        users.map((item) => {
          return {
            name: item.name,
            about: item.about,
            avatar: item.avatar,
            _id: item.id,
            email: item.email,
          };
        })
      );
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res
        .status(STATUS_OK)
        .send({ name: user.name, about: user.about, avatar: user.avatar });
    })
    .catch((error) => {
      if (error.name === CAST_ERROR) {
        return next(new BadRequestError(MSG_USER_NOT_FOUND));
      }
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const users = req.user._id;

  User.findById(users)
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user.id,
      });
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
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user.id,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Пользователь уже зарегистрирован"));
      }
      if (err.code === VALIDATION_ERROR) {
        next(new BadRequestError("Переданы некорректные данные пользователя"));
      }
      next(err);
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
        throw new NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.status(STATUS_OK).send({ name: user.name, about: user.about });
    })
    .catch((error) => {
      if (error.name === VALIDATION_ERROR) {
        next(new BadRequestError(MSG_UPDATE_USERS_DATA));
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
        throw new NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return next(new BadRequestError(MSG_INVALID_USER_DATA));
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
    .catch(() => next(new UnauthorizedError(MSG_USER_UNAUTHORIZED)));
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
