const router = require("express").Router();
const userRouter = require("./user");
const cardRouter = require("./card");
const { ERR_NOT_FOUND } = require("../errors/errors");

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use((req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: "Страница не найтена jyy" });
});

module.exports = router;
