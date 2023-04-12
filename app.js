const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes/index");
const { ERR_NOT_FOUND } = require("./errors/errors");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "64354922205bda80ef7a05c0",
  };

  next();
});

app.use(route);

app.use((req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: "Страница не найтена" });
});

app.listen(PORT, () => {
  console.log(`Start server PORT:${PORT}`);
});
