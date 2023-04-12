const route = require("express").Router();
const {
  createUser,
  getUsers,
  getUserId,
  updataUser,
  updateAvatar,
} = require("../controllers/users");

route.get("/", getUsers);
route.get("/:userId", getUserId);
route.post("/", createUser);
route.patch("/me", updataUser);
route.patch("/me/avatar", updateAvatar);

module.exports = route;
