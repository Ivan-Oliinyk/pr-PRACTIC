const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("./middlewarea/authMiddleware");
const roleMiddleware = require("./middlewarea/roleMiddleware");

router.post(
  "/registration",
  [
    check("username", "Write valid name").notEmpty(),
    check("password", "length must been 4-10 symbols").isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(["USER", "ADMIN"]), controller.getUsers);

module.exports = router;
