const User = require("./models/User.js");
const Role = require("./models/Role.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };

  return kwt.sign(payload, secret, { expiresIn: "24h" });
};
class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error with registration !", errors });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже есть !!!" });
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashPassword,
        role: [userRole.value],
      });

      await user.save();

      return res.json({ message: "User was registred !" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
    const token = generateAccessToken(user._id, user.roles);
    return res.json({ token });
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ message: `User ${username} not found !` });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Password is NOT TRUE" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Loggin error" });
    }
  }
  async getUsers(req, res) {
    try {
      // const userRole = new Role();
      // const adminRole = new Role({ value: "ADMIN" });

      // await userRole.save();
      // await adminRole.save();

      res.json("server is work !!!");
    } catch (e) {}
  }
}

module.exports = new authController();
