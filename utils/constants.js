const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_SERVER = 500;

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;
const LINK_PATTERN =
  /https?:\/\/(www\.)?[\w-@:%.\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w-.~:/[?%#@!\]$&'()*+,;=]*)/;

const VALIDATION_ERROR = "ValidationError";
const CAST_ERROR = "CastError";

const MSG_PROFILE_NOT_FOUND = "Пользователь не найден";
const MSG_USER_NOT_FOUND = "Пользователя с таким id не существует";
const MSG_REGISTERED_USER_EMAIL = "Пользователь уже зарегистрирован";
const MSG_INVALID_USER_DATA = "Переданы некорректные данные пользователя";
const MSG_UPDATE_USERS_DATA = "Невозможно обновить данные пользователя";
const MSG_USER_UNAUTHORIZED = "Неверная почта или пароль";
const MSG_INVALID_CARD_DATA = "Карточка с таким id не найдена";
const MSG_INCORRECT_DATA = "Некорректные данные";
const MSG_FORBIDDEN = "Невозможно удалить карточку";
const MSG_INVALID_LINK_FORMAT = "Неверный формат ссылки";
const MSG_PAGE_NOT_FOUND = "Страница не найтена";
const MSG_DEFAULT = "На сервере произошла ошибка";
const MSG_INVALID_MAIL_FORMAT = "Неверный формат почтового адреса";
const MSG_AUTHORIZATION_REQUIRED = "Необходима авторизация";

module.exports = {
  STATUS_OK,
  STATUS_CREATED,
  OBJECT_ID_PATTERN,
  LINK_PATTERN,
  ERROR_SERVER,
  MSG_PROFILE_NOT_FOUND,
  MSG_USER_NOT_FOUND,
  MSG_REGISTERED_USER_EMAIL,
  MSG_INVALID_USER_DATA,
  MSG_UPDATE_USERS_DATA,
  MSG_USER_UNAUTHORIZED,
  VALIDATION_ERROR,
  CAST_ERROR,
  MSG_INVALID_CARD_DATA,
  MSG_INCORRECT_DATA,
  MSG_FORBIDDEN,
  MSG_INVALID_LINK_FORMAT,
  MSG_PAGE_NOT_FOUND,
  MSG_DEFAULT,
  MSG_INVALID_MAIL_FORMAT,
  MSG_AUTHORIZATION_REQUIRED,
};
