const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')


router.post(
    "/registration",
    [
        check("username", "Name empty!").notEmpty(),
        check("password", "Password must contained 4-16 symbols").isLength({
            min: 4,
            max: 16,
        }),
    ],
    controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(['user', 'admin']), controller.getUsers);

module.exports = router;
