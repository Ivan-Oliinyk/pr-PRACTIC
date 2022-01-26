const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middlewaree/authMiddleware");

router.post(
  "/registration",
  [
    //проверяе с помощью мидлеваров валидацию
    check("username", "Имя пользователя не может быть пустым")
      .notEmpty()
      .isLength({ min: 2, max: 20 }),
    check(
      "password",
      "Пароль должен быть больше 4 и меньше 10 символов"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
// router.get("/users", controller.getUsers);

module.exports = router;
