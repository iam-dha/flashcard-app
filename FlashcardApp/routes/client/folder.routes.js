const express = require("express");
//Controllers
const controller = require("../../controllers/client/folder.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const router = express.Router();

router.get("/", authMiddleWare.checkAccessToken, controller.getAllFolders);

router.post("/", authMiddleWare.checkAccessToken, controller.createFolder);


module.exports = router;