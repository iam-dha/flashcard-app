const express = require("express");
//Controllers
const controller = require("../../controllers/admin/post.controller");
//Middlewares
const authMiddleWare = require("../../middlewares/authenticate.middleware");
const validateMiddleWare = require("../../middlewares/validate.middleware");
//Schemas

const router = express.Router();
router.get("/posts", authMiddleWare.checkAccessToken("Admin"), authMiddleWare.checkPermission("posts_view"))



module.exports = router;