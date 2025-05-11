const express = require("express");
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

router.get("/settings", authMiddleWare.checkAccessToken, controller.setting);

module.exports = router;