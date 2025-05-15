const express = require("express");

const controller = require("../../controllers/admin/auth.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const loginLimiter = require("../../limiters/loginLimiter");
const router = express.Router();

router.post("/login", loginLimiter, authMiddleWare.checkLoginRole(['Admin']), controller.loginPost);

module.exports = router;
