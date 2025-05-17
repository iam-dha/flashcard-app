const joi = require("joi");
const {
    emailField,
    passwordField,
    otpField,
    fullNameField,
    addressField,
    phoneField
} = require("../sharedFields.schema");
// Joi Schema
const loginSchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
    }),
});

const emailSchema = joi.object({
    body: joi.object({
        email: emailField,
    }),
});

const registerVerifySchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
        otp: otpField,
        fullName: fullNameField,
        address: addressField,
        phone: phoneField
    }),
});

const changePassSchema = joi.object({
    body: joi.object({
        password: passwordField,
        newPassword: passwordField,
        reNewPassword: joi.ref('newPassword')
    })
});

const newPassSchema = joi.object({
    body: joi.object({
        newPassword: passwordField,
        reNewPassword: joi.ref('newPassword')
    }),
    params: joi.object({
        token: joi.string().length(64).required(),
    })
})

module.exports = {
    loginSchema,
    emailSchema,
    registerVerifySchema,
    changePassSchema,
    newPassSchema
};
