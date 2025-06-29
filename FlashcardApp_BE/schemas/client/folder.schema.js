const joi = require("joi");
const {
    folderNameField,
    descriptionField,
    tagField,
    booleanField,
    flashcardId
} = require("../sharedFields.schema");

const folderSchema = {
    body: joi.object({
        name: folderNameField,
        description: descriptionField,
        tags: tagField,
        isPublic: booleanField.required()
    })
};

const folderAddFlashcardSchema = {
    body: joi.object({
        flashcardId: flashcardId.required(),
        folders: joi.array().items(joi.string().trim().min(1)).min(1).required(),
        noSelectedFolders: joi.array().items(joi.string().trim()).required()
    })
};

const folderAddMultiFlashcardSchema = {
    body: joi.object({
        flashcards: joi.array().items(flashcardId).min(1).required(),
        folders: joi.array().items(joi.string().trim().min(1)).min(1).required()
    })
};

module.exports = {
    folderSchema,
    folderAddFlashcardSchema,
    folderAddMultiFlashcardSchema
};