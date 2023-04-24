const User = require("../modules/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const errorList = require("../errors/index");
const {
  STATUS_CREATED,
  MSG_PROFILE_NOT_FOUND,
  MSG_USER_NOT_FOUND,
  MSG_INVALID_USER_DATA,
  MSG_USER_UNAUTHORIZED,
  CAST_ERROR,
  VALIDATION_ERROR,
} = require("../utils/constants");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const ForbiddenError = require("../errors/ForbiddenError");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
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
      return res.status(200).send(user);
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
      res.send(user);
    })
    .catch((error) => next(error));
};

const createUsers = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  console.log(req.body);
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
          email: user.email,
          password: user.password,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(MSG_REGISTERED_USER));
      }
      if (err.name === VALIDATION_ERROR) {
        return next(new BadRequestError(MSG_INVALID_USER_DATA));
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
        throw new NotFoundError(MSG_PROFILE_NOT_FOUND);
      }
      return res.status(200).send({ name: user.name, about: user.about });
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
      return res.send({ data: user });
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
