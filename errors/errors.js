const ERR_BAD_REQUEST = 400;
const ERR_NOT_FOUND = 404;
const ERR_DEFAULT = 500;

module.exports = {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
};

// .then((card) => {
//   if (!card)
//     res
//       .status(ERR_NOT_FOUND)
//       .send({ message: "Карточка c таким id не найдена" });

//   res.status(200).send(card);
// })
