const joi = require("joi");

const wordSrambleSchema = {
    body: joi.object({
        score: joi.number().integer().min(0).required(),
        duration: joi.number().integer().min(0).required(),
        scrambledWords: joi.array().items(joi.string().trim().min(1)).required(),
        correctWords: joi.array().items(joi.string().trim()).required(),
        playAt: joi.string().isoDate(),
    })
}


module.exports = {
    wordSrambleSchema
};
