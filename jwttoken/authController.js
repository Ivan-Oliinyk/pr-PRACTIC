const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

//создаем функцию для генерации токена, в пареметры принимает
//значения которые мы будем прятать внутрь токена
// значение secret-обсолютно рандомный ключ (SECRET_KEY_RANDOM) который будет знать только сервер
// ключ хранить в config либо .env
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  //возвращаем значение, { expiresIn: "24h" }- указываем сколько будет жить токен
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      //получаем ошибки из валидации в authRoutes
      const errors = validationResult(req);

      //если ошибки есть то возвращаем ошибки
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      //провереем если такой пользователь уже есть, если нашли вернули ошибку
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }

      //хешируем пароль
      const hashPassword = bcrypt.hashSync(password, 7);

      //получаем роль с базы данных
      const userRole = await Role.findOne({ value: "USER" });

      //Получаем новую модель обьекта из тех данных которые мы создали
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });

      //сохраняем в базу данных
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      //получаем из тела запроса данные
      const { username, password } = req.body;

      //ищем пользователя по имени в базе данных
      const user = await User.findOne({ username });

      // выводим ошибки в случае если пользователь не был найден
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${username} не найден` });
      }

      //если пользователь найден необходимо сравнить пароли
      // сравнием то что получили с тела запроса с зашифрованным используя bcrypt.compareSync
      const validPassword = bcrypt.compareSync(password, user.password);

      //если пароли не совпали возвращаем ошибки
      if (!validPassword) {
        return res.status(400).json({ message: `Введен неверный пароль` });
      }

      //генерируем токен
      //вызываем токен
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  }

  async getUsers(req, res) {
    try {
      //Получаем всех пользователей
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
