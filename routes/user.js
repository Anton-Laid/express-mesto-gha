const route = require("express").Router();
const {
  getUsers,
  getUserId,
  updataUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  avatarValidator,
  userIdValidator,
  profileValidator,
} = require("../validators/users");

route.get("/", getUsers);

route.get("/me", getCurrentUser);

route.get("/:userId", userIdValidator, getUserId);

route.patch("/me", profileValidator, updataUser);

route.patch("/me/avatar", avatarValidator, updateAvatar);

module.exports = route;
