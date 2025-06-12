const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// Model
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const Flashcard = require("../../models/flashcard.model");
const UserInformation = require("../../models/userInformation.model");
const translateHelper = require("../../helpers/translateEnToVi.helper");
const pexelsImageHelper = require("../../helpers/pexelsImage.helper");

module.exports.search = async (req, res) => {
    const word = req.query.word?.toLowerCase();
    try {
        const flashcardResult = await Flashcard.find({ word: word });
        if (flashcardResult.length == 0) {
            const wordSeachEndpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
                word
            )}`;
            const imageUrls = await pexelsImageHelper(word);
            let imageUrl = "https://t3.ftcdn.net/jpg/06/16/17/80/360_F_616178017_7vQYivYyYvKmzUxBOiG4mJ5nUNyjGyD4.jpg";
            if (imageUrls.length > 0) {
                imageUrl = imageUrls[0].src;
            }
            const wordSearchResponse = (await axios.get(wordSeachEndpoint))
                .data[0];
            const meanings = await Promise.all(
                (wordSearchResponse.meanings || []).map(async (meaning) => {
                    const definitions = await Promise.all(
                        (meaning.definitions || []).slice(0, 2).map(async (def) => {
                            const definition = def.definition?.trim() || "";
                            const example = def.example?.trim() || "";
                            let vi_definition = "Tạm thời chưa có";
                            if (definition) {
                                try {
                                    vi_definition = await translateHelper(
                                        definition
                                    );
                                } catch (err) {
                                    console.error("Translation Error:", err.message);
                                }
                            }

                            return { definition, example, vi_definition };
                        })
                    );

                    return {
                        partOfSpeech: meaning.partOfSpeech || "",
                        definitions,
                    };
                })
            );
            const phonetics = (wordSearchResponse.phonetics || [])
            .filter(p => p.text)
            .map(p => ({
                pronunciation: p.text,
                sound: p.audio || "",
            }));
            let flashcard = {
                image_url: imageUrl,
                word: word,
                meanings: meanings,
                phonetics: phonetics,
            };
            let record = new Flashcard(flashcard);
            await record.save();
            console.log(
                `${new Date(
                    Date.now()
                )} --- word: '${word}' was added to database`
            );
            res.json({
                result: 1,
                flashcards: [
                    {
                        _id: record._id,
                        image_url: imageUrl,
                        word: word,
                        meanings: meanings,
                        phonetics: phonetics
                    },
                ],
            });
        } else {
            res.json({
                result: flashcardResult.length,
                flashcards: flashcardResult,
            });
        }
    } catch (error) {
        if (
            String(error).startsWith(
                "AxiosError: Request failed with status code 404"
            )
        ) {
            return res.status(404).json({ message: "Word is not found." });
        }
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong. Try again later" });
    }
};
