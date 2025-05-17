const joi = require("joi");
const {
    emailField,
    passwordField,
    otpField,
    fullNameField,
    addressField,
    phoneField
} = require("../sharedFields.schema");
//Joi Schema
const loginSchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
    }),
});

module.exports = {
    loginSchema,
    
}





