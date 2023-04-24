const router = require("express").Router();
const { login, createUsers } = require("../controllers/users");
const userRouter = require("./user");
const cardRouter = require("./card");
const auth = require("../middlewares/auth");
const { signinValidator } = require("../validators/signin-validator");
const { signupValidator } = require("../validators/signup-validator");

router.post("/signup", signupValidator, createUsers);
router.post("/signin", signupValidator, login);
router.use(auth);
router.use("/users", userRouter);
router.use("/cards", cardRouter);

module.exports = router;
