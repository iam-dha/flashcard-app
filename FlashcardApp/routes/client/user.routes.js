const express = require("express");
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

router.get("/settings", authMiddleWare.checkAccessToken, controller.setting);

router.patch("/settings", authMiddleWare.checkAccessToken, controller.settingPatch);

router.post("/email-change/request", authMiddleWare.checkAccessToken, controller.changeEmailRequest);

router.post("/email-change/verify", authMiddleWare.checkAccessToken, controller.changeEmailVerify);

router.patch("/email-change", authMiddleWare.checkAccessToken, controller.changeEmail);

module.exports = router;