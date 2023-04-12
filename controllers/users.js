const User = require("../modules/user");
const {
  ERR_BAD_REQUEST,
  ERR_NOT_FOUND,
  ERR_DEFAULT,
} = require("../errors/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) =>
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" })
    );
};

const getUserId = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(ERR_BAD_REQUEST)
          .send({ messege: "Такого пользователя нет" });
      }
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(200).send(newUser))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERR_BAD_REQUEST).send({
          message: "Данные введены не корректно",
        });
      }
      return res.status(ERR_DEFAULT).send({ message: "Что-то пошло не так" });
    });
};

const updataUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERR_BAD_REQUEST).send({
          message: "Данные введены не корректно",
        });
      }
      res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERR_BAD_REQUEST).send({
          message: "Данные введены не корректно",
        });
      }
      return res.status(ERR_DEFAULT).send({ message: "Ошибка сервера" });
    });
};

module.exports = { getUsers, getUserId, createUser, updataUser, updateAvatar };
