const express = require("express");
const joi = require("joi");

const controller = require("../../controllers/admin/auth.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
const loginLimiter = require("../../limiters/loginLimiter");
const router = express.Router();

//Joi schema
const loginSchema = joi.object({
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/).required(),
    })
});


router.post("/login", loginLimiter, validateMiddleWare.validateInput(loginSchema), authMiddleWare.checkLoginRole(['Admin']), controller.loginPost);



module.exports = router;
