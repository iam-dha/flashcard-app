const express = require('express');



// Middleware
// Controller
const controller = require("../../controllers/client/post.controller");

const router = express.Router();
router.get("/", controller.getAllPosts);
router.get("/:slug", controller.getDetailPost);


module.exports = router;
