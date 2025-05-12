const express = require("express");
//Controllers
const controller = require("../../controllers/client/folder.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const router = express.Router();

router.get("/", authMiddleWare.checkAccessToken, controller.getAllFolders);

router.post("/", authMiddleWare.checkAccessToken, controller.createFolder);

router.get("/:slug", authMiddleWare.checkAccessToken, controller.getFolderBySlug);

router.delete("/:slug", authMiddleWare.checkAccessToken, controller.deleteFolder);

router.get("/:slug/flashcards", authMiddleWare.checkAccessToken, controller.getFolderFlashcards);

router.post("/:slug/flashcards", authMiddleWare.checkAccessToken, controller.addFlashcard);

router.get("/:slug/flashcards/:fc_slug", authMiddleWare.checkAccessToken, controller.getFlashcardInFolder);

router.delete("/:slug/flashcards/:fc_slug", authMiddleWare.checkAccessToken, controller.deleteFlashcardInFolder);

module.exports = router;