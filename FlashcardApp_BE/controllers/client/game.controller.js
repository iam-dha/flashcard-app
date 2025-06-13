const mongoose = require('mongoose');
const FolderFlashcard = require("../../models/folderFlashcard.model");
const Flashcard = require("../../models/flashcard.model");
const getCambridgeWordScramble = require("../../helpers/cambridgeWordScamble.helper");


// [GET] /api/v1/game/word-scramble
module.exports.getWordScramble = async (req, res) => {
    try {
    const flashcards = await Flashcard.aggregate([{ $sample: { size: 10 } }]);

    const result = flashcards.map((card) => {

      const allDefinitions = card.meanings
        .flatMap(m => m.definitions || [])
        .filter(def => def.definition);

      const randomDef =
        allDefinitions.length > 0
          ? allDefinitions[Math.floor(Math.random() * allDefinitions.length)]
          : null;

      return {
        word: card.word,
        definition: randomDef ? randomDef.definition : "Không có định nghĩa",
      };
    });

    res.json({
      count: result.length,
      data: result,
    });
  } catch (err) {
    console.error("Lỗi khi lấy random definitions:", err.message);
    res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
  }
    
}