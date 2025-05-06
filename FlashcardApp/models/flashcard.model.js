const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const flashcard_schema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
        },
        definition: {
            type: String,
            required: true,
            trim: true,
        },
        vi_definition: {
            type: String,
            required: true,
            trim: true,
        },
        pronunciation: {
            type: String,
            trim: true,
        },
        audio_href: {
            type: String,
            trim: true,
        },
        example: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            slug: "word",
            unique: true
        }
    },
    {
        timestamps: true,
    }
);

const Flashcard = mongoose.model("Flashcard", flashcard_schema, "flashcards");
module.exports = Flashcard;