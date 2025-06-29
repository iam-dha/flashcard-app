const express = require("express");

// Controllers
const controller = require("../../controllers/client/game.controller");

// Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleware = require("../../middlewares/validate.middleware");

// Schemas
const {wordSrambleSchema} = require("../../schemas/client/gameSession.schema");

const router = express.Router();

router.get("/word-scramble", controller.getWordScramble);

router.post("/word-scramble", authMiddleWare.checkAccessToken(), validateMiddleware.validateInput(wordSrambleSchema), controller.createWordScrambleSession);

router.get("/word-scramble/history", authMiddleWare.checkAccessToken(), controller.getWordScrambleHistory);

router.get("/word-scramble/history/:id", authMiddleWare.checkAccessToken(), controller.getWordScrambeSessionDetail);

module.exports = router;
