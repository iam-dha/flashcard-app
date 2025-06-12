const express = require("express");
const controller = require("../../controllers/client/game.controller");

const router = express.Router();

router.get("/word-scramble", controller.getWordScramble);


module.exports = router;
