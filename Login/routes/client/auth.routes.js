const express = require("express");
const loginLimiter = require("../../limiters/loginLimiter");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");

router.post("/login", loginLimiter, controller.loginPost);

router.post("/register/request-otp", controller.registerOTP);

router.post("/register/verify", controller.registerVerify);

router.post("/refresh", controller.refreshPost);

module.exports = router;


