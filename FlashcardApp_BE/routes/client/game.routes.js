const express = require("express");
const controller = require("../../controllers/client/game.controller");

const authMiddleWare = require("../../middlewares/authenticate.middleware");

const router = express.Router();

router.get("/word-scramble", controller.getWordScramble);

router.post("/word-scramble", authMiddleWare.checkAccessToken(), controller.createWordScrambleSession);


module.exports = router;
