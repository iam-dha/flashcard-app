const express = require("express");
const loginLimiter = require("../../limiters/loginLimiter");
const router = express.Router();
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const controller = require("../../controllers/client/auth.controller");

router.post("/login", loginLimiter, controller.loginPost);

router.post("/register/request-otp", controller.registerOTP);

router.post("/register/verify", controller.registerVerify);

router.post("/refresh", controller.refreshPost);

router.post("/change-password", authMiddleWare.checkAccessToken, validateMiddleWare.validatePassword(['password', 'newPassword']), controller.changePassword);

router.post("/forgot-password", controller.forgotPassword);

router.post("/reset-password/:token", validateMiddleWare.validatePassword(['newPassword']), controller.resetPassword);

module.exports = router;


