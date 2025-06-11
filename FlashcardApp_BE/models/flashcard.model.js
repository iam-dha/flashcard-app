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
        image_url : {
            type: String,
            trim: true,
            default: "https://t3.ftcdn.net/jpg/06/16/17/80/360_F_616178017_7vQYivYyYvKmzUxBOiG4mJ5nUNyjGyD4.jpg",
        },
        meanings: [
            {
                partOfSpeech: {type: String},
                definitions: [
                    {
                        definition: {type: String, trim: true},
                        example: {type: String, trim: true},
                        vi_definition: {type: String, trim: true},
                    }
                ]
            }
        ],
        phonetics:[
            {
                pronunciation: {type: String, required: true},
                sound: {type: String}
            }
        ],
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