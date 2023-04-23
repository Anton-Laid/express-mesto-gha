const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes/index");
const NotFoundError = require("./errors/NotFoundError");
const {
  ERROR_SERVER,
  MSG_PAGE_NOT_FOUND,
  MSG_DEFAULT,
} = require("./utils/constants");
const { errors } = require("celebrate");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(route);

app.use((req, res, next) => {
  next(new NotFoundError(MSG_PAGE_NOT_FOUND));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;

  res.status(statusCode).send({
    message: statusCode === ERROR_SERVER ? MSG_DEFAULT : message,
  });
});
app.listen(PORT, () => {
  console.log(`Start server PORT:${PORT}`);
});
